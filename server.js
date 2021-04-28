const express = require('express');
const path = require('path');
const socket = require('socket.io');

let tasks = [];

const app = express();

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...')
});

const io = socket(server);

io.on('connection', (socket) => {
    socket.emit('updateData', tasks);
    socket.on('addTask', task => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
    });
    socket.on('removeTask', delTask => {
        tasks.filter(task => task.id !== delTask);
        socket.broadcast.emit('removeTask', delTask);
    });
});

app.use((req, res) => {
    res.status(404).send({ message: '404 not found...' })
});