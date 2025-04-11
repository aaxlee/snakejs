import { socket, WIDTH, HEIGHT, join_button, title_screen, canvas_container, c, ctx, grid_size, TARGET_FPS, FRAME_TIME } from "./constants.js";
import { draw_grid, draw_food, draw_state, draw_death_screen, draw_end_screen } from "./rendering.js";
import "./events.js";

export let s;
export let id;
export let player_index = -1;
let game_over = 0;

join_button.addEventListener("click", () => {
        title_screen.style.display = "none";
        canvas_container.style.display = "flex";

        socket.emit("join_game");
});

const vote_container = document.getElementById("vote-container");
const vote_button = document.getElementById("vote-button");

vote_button.addEventListener("click", () => {
	socket.emit("player_vote");
	vote_button.disabled = true;
});

socket.on("game_init", (state, socket_id) => {
        s = state;
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

socket.on("server_upd", (state) => {
        s = state;
});

socket.on("game_over", (state) => {
	s = state;
	game_over = 1;
});

socket.on("reset_vote", () => {
	vote_container.style.display = "block";
	vote_button.disabled = false;
});

socket.on("reset_success", (state) => {
	vote_container.style.display = "none";
	vote_button.disabled = true;
	game_over = 0;
	s = state;

	requestAnimationFrame(main);
});

let last_timestamp = 0;
let last_frame_time = 0;
let fps;
let count = 0;

function main(timestamp)
{
	if (!game_over) {
		let dtime = timestamp - last_frame_time;

		if (dtime >= FRAME_TIME) { 
			last_frame_time = timestamp;

			ctx.clearRect(0, 0, 900, 450);
			if (!s.players[player_index].is_alive) {
				draw_death_screen();
			}
			draw_grid();
			draw_food();
			draw_state(s);

			last_timestamp = timestamp;
		}

		count++;
		requestAnimationFrame(main);
	} else {
		draw_end_screen();
	}
}
