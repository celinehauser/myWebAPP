const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 8080;

// Data structure for tasks
let lists = []; // Array to store lists, each with tasks and metadata

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the index.html file
app.use(express.static(path.join(__dirname, 'public')));

// About page route
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Get all lists
app.get('/lists', (req, res) => {
    res.json(lists);
});

// Add new list
app.post('/lists', (req, res) => {
    const newList = { id: Date.now().toString(), name: req.body.name, tasks: [] };
    lists.push(newList);
    console.log("Current lists:", lists); // Add this line
    res.status(201).json(newList);
});

// Add a task to a specific list
app.post('/lists/:id/tasks', (req, res) => {
    const list = lists.find(l => l.id === req.params.id);
    if (list) {
        const newTask = { id: Date.now().toString(), name: req.body.name, completed: false };
        list.tasks.push(newTask);
        console.log("Task added to list:"+ newTask.name);
        res.status(201).json(newTask);
    } else {
        res.status(404).send("List not found.");
    }
});

// Update task completion status within a specific list
app.put('/lists/:listId/tasks/:taskId', (req, res) => {
    const list = lists.find(l => l.id === req.params.listId);
    if (list) {
        const task = list.tasks.find(t => t.id === req.params.taskId);
        if (task) {
            task.completed = req.body.completed;
            console.log("Task updated:", task.name);
            res.json(task);
        } else {
            res.status(404).send("Task not found.");
        }
    } else {
        res.status(404).send("List not found.");
    }
});

// Delete task within a list
app.delete('/lists/:listId/tasks/:taskId', (req, res) => {
    const list = lists.find(l => l.id === req.params.listId);
    
    if (list) {
        const taskIndex = list.tasks.findIndex(task => task.id === req.params.taskId);
        if (taskIndex !== -1) {
            const deletedTask = list.tasks.splice(taskIndex, 1);
            console.log("Task deleted: " + deletedTask[0].name);
            res.status(204).send();
        } else {
            res.status(404).send("Task not found.");
        }
    } else {
        res.status(404).send("List not found.");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
