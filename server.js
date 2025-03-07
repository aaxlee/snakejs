const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const port = 3000;
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "public", "index.html"));
});

io.on("connection", (socket) => {
        console.log("a user connected");
        socket.on("disconnect", () => {
                console.log("user disconnected");
        });
});

server.listen(port, () => {
        console.log("listening on port " + port);
});
