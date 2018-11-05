const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
let todos = [];
let todoNextId = 1;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Todo API Root');
});

// GET /todos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
    let todoId = parseInt(req.params.id, 10);
    let matchedTodo;

    todos.forEach((todo) => {
        if (todoId === todo.id) {
            matchedTodo = todo;
        }
    });

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

app.post('/todos', (req, res) => {
    let body = req.body;

    // Add id field to the object
    body.id = todoNextId++;
    
    // Push body into array
    todos.push(body);

    res.json(body);
});

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}!`);
});