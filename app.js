const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const PORT = 14783;

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'todo-list-app';

// App init
const app = express();
// MongoDB client init
const client = new MongoClient(MONGO_URL);


/* ----- Middleware ----- */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));


/* ----- View Setup ----- */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


/* ----- Queries ----- */
async function collectTodos()
{
    const db = await client.db(DB_NAME);
    const Todos = await db.collection('todos');
    return Todos;
}

async function getAllTodos()
{
    Todos = await collectTodos();
    const todos = await Todos.find({}).toArray();
    return todos;
}

async function getTodo(id)
{
    Todos = await collectTodos();
    const o_id = new ObjectId(id);
    const todos = await Todos.findOne({_id: o_id})
        .catch((err) => {
            console.error("Failed to fetch the Task with the id:", id, "\nError:\n", err);
    });
    return todos;
}

async function addTodo(todo)
{
    Todos = await collectTodos();
    await Todos.insertMany([todo])
        .then(() => {
            console.log("Task Added!\nTask:", todo);
        })
        .catch((err) => {
            console.error("Failed to add the task\n", todo, "Error:\n", err);
    });
}

async function deleteTodo(id)
{
    Todos = await collectTodos();
    const o_id = new ObjectId(id);
    await Todos.deleteOne({_id: o_id})
        .then(() => {
            console.log("Deleted the task with id:", id);
        })
        .catch((err) => {
            console.error("An error occured while deleting a task\n", err);
        });
}

async function updateTodo(id, todo)
{
    Todos = await collectTodos();
    const o_id = new ObjectId(id);
    await Todos.updateOne({_id: o_id}, {$set: todo})
        .then(() => {
            console.log("Updated the task with id", id, "to:\n", todo);
        })
        .catch((err) => {
            console.error("Failed to update the task with id", id, "\nError\n:", err);
        })
}


/* ----- ROUTES ----- */
app.get('/', async (req, res) => {
    const todos = await getAllTodos();
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

app.delete('/todo/delete/:id', async (req, res) => {
    await deleteTodo(req.params.id);
    res.sendStatus(200);
});

app.get('/todo/edit/:id', async (req, res) => {
    todo = await getTodo(req.params.id);
    res.render('edit', {
        todo: todo
    });
});

app.post('/todo/edit/:id', async (req, res) => {
    const id = req.params.id;
    const todo = {
        task: req.body.task,
        desc: req.body.desc
    }

    await updateTodo(id, todo);
    res.redirect('/')
});


/* ----- Main ----- */
async function main()
{
    /* ----- MongoDB client connection ----- */
    await client.connect()
        .then(() => {
            console.log('Connected to MongoDB Successfully');
        })
        .catch((err) => {
            console.error('Failed to connect to MongoDB!\n', err);
        });

    /* ----- Server Start ----- */
    app.listen(PORT, () => {
        console.log("Server is running on port " + PORT);
    });
}

main();