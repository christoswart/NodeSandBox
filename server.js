'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
    .use((req, res) => res.sendFile(INDEX))
    .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));

    //Send Data From Server To Client
    socket.emit('message', { 'message': 'Hello from the Server, Setting first color!' });
    socket.emit('coloranim', { 'color': 'LightBlue' });
    socket.emit('numbers', { 'number1': '1', 'number2': '2' });

    //Receive Data From Client
    socket.on('client_data', function(data) {

        socket.emit('message', { 'message': data.letter });
        socket.broadcast.emit('message', { 'message': data.letter });
        //process.stdout.write(data.letter);
        console.log(data.letter);
    });

    socket.on('client_color', function(data) {

        socket.emit('coloranim', { 'color': data.color });
        socket.broadcast.emit('coloranim', { 'color': data.color });
        //process.stdout.write(data.color);
        console.log(data.color);
    });

    socket.on('client_numbers', function(data) {
        //console.log(JSON.stringify(data));
        var ran1 = Math.random() * 100;
        var ran2 = Math.random() * 200;
        socket.emit('numbers', { 'number1': ran1, 'number2': ran2 });
        socket.broadcast.emit('numbers', { 'number1': ran1, 'number2': ran2 });
        console.log(ran1 + ' and ' + ran2);
    });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);