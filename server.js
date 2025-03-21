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

const Game = require("./game/game.js");
const Player = require("./game/player.js");
const Events = require("./game/events.js");

function get_random_color() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

io.on("connection", (socket) => {
        let socket_id = socket.id;
        console.log("a user connected");

        let player = Player.create_player(Game.state, socket_id, get_random_color());
        let player_index = player.id;
        Game.state.players.push(player);

        if (Game.state.players.length >= 3) {
                Game.state.grid_size /= 2;
        }

        console.log(player);
        socket.emit("game_init", Game.state, socket_id);

        socket.on("disconnect", () => {
                console.log("user disconnected");
        });

        socket.on("client_event", (e, id) => {
                for (let i = 0; i < Game.state.players.length; i++) {
                        if (Game.state.players[i].socket_id == id) {
                                Events.process_event(e, Game.state.players[i]);
                        }
                }
        });

});

const TICK_RATE = 60 * 4
setInterval(() => {
        Game.warp_snakes();
        Game.update_snakes();
        io.emit("server_upd", Game.state);
}, TICK_RATE);

server.listen(port, "0.0.0.0", () => {
        console.log("listening on port " + port);
});
