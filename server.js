const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
let todos = [{
        id: 1,
        description: 'Meet mum for lunch',
        completed: false
    },
    {
        id: 2,
        description: 'Go to market',
        completed: false
    },
    {
        id: 3,
        description: 'Water the garden',
        completed: true
    }
];

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

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}!`);
});