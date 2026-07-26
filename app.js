// app.js - Express CRUD Todo API with Input Validation & Filtering
require('dotenv').config();
const express = require('express');
const app = express();

// Body parsing middleware (Parses incoming JSON requests)
app.use(express.json());

// In-memory data store
let todos = [
    { id: 1, task: 'Learn Node.js', completed: false },
    { id: 2, task: 'Build CRUD API', completed: false }
];

// 1. GET ALL TODOS
app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

// 2. GET ACTIVE TODOS (Bonus Requirement Filter: completed = false)
// NOTE: Must be defined BEFORE /todos/:id
app.get('/todos/active', (req, res) => {
    const activeTodos = todos.filter(t => !t.completed);
    res.status(200).json(activeTodos);
});

// 3. GET SINGLE TODO BY ID (Single Read Requirement)
app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(todo);
});

// 4. POST NEW TODO (With Validation Requirement)
app.post('/todos', (req, res) => {
    const { task } = req.body;
    
    // Input Validation: Require task string
    if (!task || typeof task !== 'string' || task.trim() === '') {
        return res.status(400).json({ error: 'Task field is required and cannot be empty' });
    }
    
    const newTodo = {
        id: todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1,
        task: task.trim(),
        completed: false
    };
    
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// 5. PATCH UPDATE TODO
app.patch('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    
    if (req.body.task !== undefined) todo.task = req.body.task;
    if (req.body.completed !== undefined) todo.completed = req.body.completed;
    
    res.status(200).json(todo);
});

// 6. DELETE REMOVE TODO
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const initialLength = todos.length;
    
    todos = todos.filter(t => t.id !== id);
    
    if (todos.length === initialLength) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send();
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error!' });
});

// SERVER LISTEN
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
});