const Game = require("../game/game.js");
const Player = require("../game/player.js");
const Events = require("../game/events.js");

function get_random_color()
{
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

module.exports = (io) => io.on("connection", (socket) => {
        let socket_id = socket.id;
        console.log("a user connected");

        socket.on("join_game", (width, height) => {
                let player = new Player({x: 0, y: 0}, socket_id, get_random_color());
                let player_index = player.id;
                Game.state.players.push(player);

                if (Game.state.players.length % 3 == 0) {
                        Game.state.grid_size /= 2;
			Game.state.food_threshold = Math.floor(Game.state.food_threshold * 0.7);
                }

                console.log(player);
                socket.emit("game_init", Game.state, socket_id);
        });

        socket.on("disconnect", () => {
                console.log("user disconnected");
		Game.state.players = Game.state.players.filter(player => player.socket_id != socket_id);
        });

        socket.on("client_event", (e, id) => {
                for (let i = 0; i < Game.state.players.length; i++) {
                        if (Game.state.players[i].socket_id == id) {
                                Events.process_event(e, Game.state.players[i]);
                        }
                }
        });

	socket.on("player_vote", (id) => {
		Game.state.restart_votes++;
		if (Game.state.restart_votes == Game.state.players.length) {
			Game.reset();
			io.emit("reset_success", Game.state);
		}
	});

});

