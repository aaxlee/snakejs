import { socket, vote_container, vote_button } from "./constants.js";
import { main, game_over } from "./main.js";

export let state;
export let id;
export let player_index = -1;

socket.on("game_init", (client_state, socket_id) => {
        state = client_state;
        id = socket_id;

        for (let i = 0; i < state.players.length; i++) {
                if (state.players[i].socket_id == socket_id) {
                        player_index = i;
                        break;
                }
        }

        if (player_index != -1) {
                requestAnimationFrame(main);
        } else {
                console.log("Player index error");
        }
});

socket.on("server_upd", (client_state) => {
        state = client_state;
});

socket.on("game_over", (client_state) => {
	state = client_state;
	game_over = 1;
});

socket.on("reset_vote", () => {
	vote_container.style.display = "block";
	vote_button.disabled = false;
});

socket.on("reset_success", (client_state) => {
	vote_container.style.display = "none";
	vote_button.disabled = true;
	game_over = 0;
	state = client_state;

	requestAnimationFrame(main);
});
