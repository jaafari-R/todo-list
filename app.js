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


/* ----- MongoDB client & db & collections ----- */
const client = new MongoClient(MONGO_URL);
client.connect();
console.log('Connected to MongoDB successfully!');
const db = client.db(DB_NAME);
const Todos = db.collection('todos');


/* ----- Queries ----- */
async function getTodos()
{
    const todos = await Todos.find({}).toArray();
    return todos;
}

async function addTodo(todo)
{
    await Todos.insertMany([todo], (err, result) => {
        if(err) {
            return console.log(err);
        }
        console.log("Task Added!");
    });
}


/* ----- ROUTES ----- */
app.get('/', async (req, res) => {
    const todos = await getTodos();
    // console.log(todos);
    res.render('index', {
        todos: todos
    });
});

app.post('/todo/add', async (req, res) => {
    const todo = {
        task: req.body.task,
        desc: req.body.desc
    }

    await addTodo(todo);
    res.redirect('/');
});


/* ----- Server Start ----- */
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});