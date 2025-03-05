const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;
const fs = require("fs");
const { Socket } = require('dgram');


let playerlist = {};


app.use(express.static("public"));

app.get('/', (req, res) => {

    res.sendFile("./index.html");
});



io.on("connection", (socket) => {

    console.log("new player has connected");
    console.log(socket.id);



    socket.on("disconnect", () => {
        console.log("PLayer has disconnected")
    })

    socket.on("uploadposition", (position) => {


        playerlist[socket.id] = position;
        // console.log(playerlist);
        socket.broadcast.emit("playermoved", {id: socket.id, position});

    })


});







server.listen(port, () => {
    console.log(`Server is listening at the port: ${port}`);
});