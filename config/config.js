// Ce fichier contient toutes les variables d'environnement de l'application
module.exports = {
    // On définit l'adresse ip de mongo dans le cas où docker n'est pas utilisé, sinon on met le nom du service
    MONGO_IP: process.env.MONGO_IP || "mongo-db",
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    // On définit l'adresse ip de redis dans le cas où docker n'est pas utilisé, sinon on met le nom du service
    REDIS_HOST: process.env.REDIS_HOST || "redis",
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    SESSION_SECRET: process.env.SESSION_SECRET,
    REDIS_URL: process.env.REDIS_URL || "redis://redis:6379"
};