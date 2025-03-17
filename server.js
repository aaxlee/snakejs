const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const port = 3000;
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

const grid_size = 50;

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
                dir: {
                        left: false,
                        right: false,
                        up: false,
                        down: false
                },
                len: 1,
                connected: 1,
        };
        state.players.push(p);
        return p;
}

function update_positions()
{
        for (let i = 0; i < state.players.length; i++) {
                if (state.players[i].dir.up) {
                        state.players[i].pos.y -= grid_size;
                } else if (state.players[i].dir.down) {
                        state.players[i].pos.y += grid_size;
                } else if (state.players[i].dir.left) {
                        state.players[i].pos.x -= grid_size;
                } else if (state.players[i].dir.right) {
                        state.players[i].pos.x += grid_size;
                }
        }
}

io.on("connection", (socket) => {
        let socket_id = socket.id;
        console.log("a user connected");

        let player = create_player();
        let player_index = player.id;

        console.log(player);
        socket.emit("game_init", player, state, socket_id, player_index);

        socket.on("disconnect", () => {
                console.log("user disconnected");
        });

        socket.on("client_upd", (s, client_id) => {
                state = s;
                update_positions();
                io.emit("server_upd", state);
        });
});

server.listen(port, "0.0.0.0", () => {
        console.log("listening on port " + port);
});
