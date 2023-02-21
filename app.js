const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const PORT = 14783;

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'todo-list-app';

// App init
const app = express();


/* ----- Middleware ----- */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));


/* ----- View Setup ----- */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/* MongoDB client */
const client = new MongoClient(MONGO_URL);


/* ----- ROUTES ----- */
app.get('/', (req, res, next) => {
    res.render('index');
});


async function main() {
    /* Connect to MongoDB */
    await client.connect();
    console.log('Connected to MongoDB successfully!');
    const db = client.db(DB_NAME);
    const Todos = db.collection('todos');

    /* ----- Server Start ----- */
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    });

}

main()