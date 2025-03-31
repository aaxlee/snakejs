const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const port = 3000;
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(path.join(__dirname, "../client")));

app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "index.html"));
});

// import socket handler
require("./sockets.js")(io);

const Game = require("../game/game.js");

function print_map()
{
        console.clear();
        console.log(Game.map.map(row => row.map(cell => (cell.is_occupied ? '█' : '.')).join(' ')).join('\n'));
}

const TICK_RATE = 60 * 4
let counter = 1;
setInterval(() => {
        Game.update_map();
        Game.check_collision();
	Game.update_snakes();
	Game.warp_snakes();
        if (counter == 15) {
                Game.generate_food();
                counter = 0;
        }
        // print_map();

        io.emit("server_upd", Game.state);
        
        counter++;
}, TICK_RATE);

server.listen(port, "0.0.0.0", () => {
        console.log("listening on port " + port);
});

