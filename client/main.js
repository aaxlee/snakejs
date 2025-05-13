import { state, player_index } from "./sockets.js";
import { ctx, WIDTH, HEIGHT, TARGET_FPS, FRAME_TIME } from "./constants.js";
import { draw_grid, draw_food, draw_state,
         draw_death_screen, draw_end_screen
} from "./rendering.js";
import "./events.js";

export let game_over = 0;
let last_timestamp = 0;
let last_frame_time = 0;

export function main(timestamp)
{
	if (!game_over) {
		let dtime = timestamp - last_frame_time;

		if (dtime >= FRAME_TIME) { 
			last_frame_time = timestamp;

			ctx.clearRect(0, 0, WIDTH, HEIGHT);
			if (!state.players[player_index].is_alive) {
				draw_death_screen();
			}
			draw_grid();
			draw_food();
			draw_state(state);

			last_timestamp = timestamp;
		}

		requestAnimationFrame(main);
	} else {
		draw_end_screen();
	}
}
