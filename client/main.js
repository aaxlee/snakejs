import { socket, WIDTH, HEIGHT, c, ctx, grid_size, TARGET_FPS, FRAME_TIME } from "./constants.js";
import { draw_grid, draw_food, draw_state } from "./rendering.js";
import "./events.js";

export let s;
export let id;
export let player_index = -1;

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

let last_timestamp = 0;
let last_frame_time = 0;
let fps;
let count = 0;
function main(timestamp)
{
        let dtime = timestamp - last_frame_time;

        if (dtime >= FRAME_TIME) { 
                last_frame_time = timestamp;

                ctx.clearRect(0, 0, 900, 450);
                draw_grid();
                draw_food();
                draw_state(s);

                last_timestamp = timestamp;
        }

        count++;
        requestAnimationFrame(main);
}
