const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const port = 3000;
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "client")));

app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "client", "index.html"));
});

let state = {
        players: []
};

function create_player()
{
        let p = {
                id: state.players.length,
                pos: { x: 0, y: 0 },
                len: 1
        };
        state.players.push(p);
        return p;
}

io.on("connection", (socket) => {
        let socket_id = socket.id;
        console.log("a user connected");

        let player = create_player();
        console.log(player);
        socket.emit("game_init", player, state, socket_id);

        socket.on("disconnect", () => {
                console.log("user disconnected");
        });

        socket.on("client_upd", (p, client_id) => {
                for (let i = 0; i < state.players.length; i++) {
                        if (state.players[i].id == p.id) {
                                state.players[i] = p;
                                break;
                        }
                }
                io.emit("server_upd", state);
        });
});

server.listen(port, () => {
        console.log("listening on port " + port);
});
