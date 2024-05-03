const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let connections = [];

io.on('connection', (socket) => {
    connections.push(socket);
    console.log('Client connected');

    socket.on('disconnect', () => {
        connections = connections.filter((conn) => conn !== socket);
        console.log('Client disconnected');
    });
});

http.listen(3000, () => {
    console.log('Server started');
});