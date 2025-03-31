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

        socket.on("join_game", () => {
                let player = new Player({x: 0, y: 0}, socket_id, get_random_color());
                let player_index = player.id;
                Game.state.players.push(player);

                if (Game.state.players.length % 3 == 0) {
                        Game.state.grid_size /= 2;
                }

                console.log(player);
                socket.emit("game_init", Game.state, socket_id);
        });

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
