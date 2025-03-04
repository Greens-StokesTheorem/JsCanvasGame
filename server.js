const express = require('express');
const app = express();
const { Server } = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);
const port = 8080;
const fs = require("fs");
const { Socket } = require('dgram');

app.use(express.static("public"));

app.get('/', (req, res) => {

    res.sendFile("./index.html");
});



io.on("connection", (socket) => {

    console.log("new player has connected");




    socket.on("disconnect", () => {
        console.log("PLayer has disconnected")
    })

});


server.listen(port, () => {
    console.log(`Server is listening at the port: ${port}`);
});