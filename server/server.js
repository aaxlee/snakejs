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

require("./sockets.js")(io);

const Game = require("../game/game.js");

function print_map()
{
        console.clear();
        console.log(Game.map.map(row => row.map(cell => (cell.is_occupied ? '█' : '.')).join(' ')).join('\n'));
}

const TICK_RATE = 60 * 4 / 2;
let counter = 1;
let started = 0;
Game.update_map();
setInterval(() => {
	if (Game.state.players.length > 1) {
		started = 1;
	}
	if (Game.state.over && started) {
		io.emit("game_over", Game.state);
		io.emit("reset_vote");
		counter = 1;
	} else {
		Game.update_snakes();
		Game.handle_borders();
                Game.update_map();
                Game.check_headon_collision();
                Game.check_collision();
                Game.is_game_over();

                if (Game.exists_weak_player()) {
                        Game.state.food_cooldown = 32 * 8;
                } else {
                        Game.state.food_cooldown = 32;
                }

		if (counter == Game.state.food_cooldown) {
			Game.generate_food();
			counter = 0;
		}
		// print_map();

		io.emit("server_upd", Game.state);
		
		counter++;
	}
}, TICK_RATE);

server.listen(port, "0.0.0.0", () => {
        console.log("listening on port " + port);
});
