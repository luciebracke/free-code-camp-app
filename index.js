const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis').default
const cors = require('cors');

const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_IP,
    MONGO_PORT,
    REDIS_HOST,
    REDIS_URL,
    SESSION_SECRET,
    REDIS_PORT } = require('./config/config');

let redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    url: REDIS_URL
});

redisClient.connect().catch(console.error)


const postRouter = require('./routes/post-routes');
const userRouter = require('./routes/user-routes');

const app = express();

// l'adresse ip du container mongo peut être trouvée avec la commande docker inspect "nom du container" ou docker inspect "id du container"
// Il se trouve dans IPAddress
// Dans le cas où le container mongo est lancé avec docker-compose, il faut utiliser le nom du service (mongo-db) et non l'adresse ip
// référer le nom du service dans le docker-compose.yml permet de ne pas avoir à changer l'adresse ip à chaque fois que le container est relancé
// Docker se charge de mettre la bonne adresse ip à partir du nom du service
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

// Essaie de se connecter à la base de données un certain nombre de fois avant de renvoyer une erreur
const connectWithRetry = () => {
    mongoose
        .connect(mongoURL)
        .then(() => console.log("Successfully connected to DB"))
        .catch((error) => {
            console.log(error)
            setTimeout(connectWithRetry, 5000)
        });
};

connectWithRetry();

// Option nécessaire pour avoir accès aux adresses ip, particulièrement utilisé en prod
app.enable('trust proxy')
app.use(cors({}));
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        saveUninitialized: false,
        resave: false,
        httpOnly: true,
        maxAge: 30000
    }
}))

app.use(express.json());

app.get('/api/v1', (req, res) => {
    res.send('Hello World! I am still changing 1');
    console.log("Yeah, it's working")
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 30000;

app.listen(port, () => console.log(`Listening on port ${port}`));