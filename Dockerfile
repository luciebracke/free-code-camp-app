# Le dockefile permet de pouvoir mettre tout notre code source et nos dépendances dans le conteneur qu'on va créer

# On va utiliser l'image node comme base
FROM node

# Crée un dossier app dans le conteneur
# Toutes les commandes qu'on lancera après seront exécutées dans ce dossier
WORKDIR /app
# On copie le fichier package.json qui contient toutes nos dépendances dans le conteneur
# Le . à la fin signifie qu'on copie le fichier dans le dossier courant (app)
COPY package.json .
# Cet argument est nécessaire pour le passer dans la condition juste en dessous
ARG NODE_ENV
# On lance la commande npm install pour installer toutes les dépendances à partir du fichier package.json
# On utilise un if pour savoir si on est en environnement de développement ou de production
# Si on est en environnement de développement, on installe toutes les dépendances
# Si on est en environnement de production, on installe seulement les dépendances nécessaires pour faire fonctionner l'application
RUN if [ "$NODE_ENV" = "development" ]; \ 
        then npm install; \
        else npm install --only=production; \
    fi
# On copie tout le code source dans le conteneur, (premier . = dossier courant, deuxième . = dossier courant du conteneur)
# La raison pour laquelle on copie le code source après avoir installé les dépendances est que chaque étape est mise en cache
# Si on change le code source et que les dépendances n'ont pas été modifiées ou ajoutées, Docker va voir que le fichier package.json 
# n'a pas changé et ne va pas relancer l'installation des dépendances car le cache est toujours valide
COPY . .
# On crée une variable d'environnement PORT avec pour valeur par défaut 3000
ENV PORT 3000
# La commande EXPOSE n'a aucun effet sur le conteneur, elle permet juste de documenter le port sur lequel notre application va écouter
EXPOSE $PORT
# On indique à notre conteneur quelle commande il doit lancer quand on le démarre
# Ici, on lance la commande npm run dev lors du déploiement du conteneur
# npm run dev est une commande qui est définie dans le fichier package.json
# A noter que le serveur node js ne se remet pas à jour automatiquement quand on modifie le code source
# Nous allons donc utiliser un outil qui s'appelle nodemon qui va redémarrer le serveur à chaque fois qu'on modifie le code source (dans le cas où notre conteneur est relié à un volume)
CMD ["node", "index.js"]