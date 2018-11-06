const express = require('express');
const bodyParser = require('body-parser');
const _ =require('underscore');

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
    let matchedTodo = _.findWhere(todos, {id: todoId});
    // let matchedTodo;

    // todos.forEach((todo) => {
    //     if (todoId === todo.id) {
    //         matchedTodo = todo;
    //     }
    // });

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

app.post('/todos', (req, res) => {
    // Pick only description and completed from user
    let body = _.pick(req.body, 'description', 'completed');

    // Validate user inputs
    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    // Remove spaces around user description
    body.description = body.description.trim();

    // Add id field to the object
    body.id = todoNextId++;
    
    // Push body into array
    todos.push(body);

    // Send user info back to user
    res.json(body);
});

app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}!`);
});