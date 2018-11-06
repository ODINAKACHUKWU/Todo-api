const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');

const app = express();
const PORT = process.env.PORT || 3000;
let todos = [];
let todoNextId = 1;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Todo API Root');
});

app.get('/todos', (req, res) => {
    let queryParams = req.query;
    let filteredTodos = todos;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {completed: true});
    } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }

    res.json(filteredTodos);
});

// GET /todos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', (req, res) => {
    let todoId = parseInt(req.params.id, 10);
    let matchedTodo = _.findWhere(todos, {
        id: todoId
    });
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

app.delete('/todos/:id', (req, res) => {
    let todoId = parseInt(req.params.id, 10);
    let matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (!matchedTodo) {
        res.status(404).json({
            "error": "no todo found with that id"
        });
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
});

app.put('/todos/:id', (req, res) => {
    let todoId = parseInt(req.params.id, 10);
    let matchedTodo = _.findWhere(todos, {
        id: todoId
    });
    let body = _.pick(req.body, 'description', 'completed');
    let validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
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