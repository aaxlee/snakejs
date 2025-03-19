import { socket, WIDTH, HEIGHT, c, ctx, grid_size, TARGET_FPS, FRAME_TIME } from "./constants.js";
import { draw_grid, draw_player, draw_state } from "./rendering.js";
import "./events.js";

export let s;
export let p;
export let id;
export let player_index;

socket.on("game_init", (player, state, socket_id, index) => {
        console.log(player);
        p = player;
        s = state;
        id = socket_id;
        player_index = index;
        requestAnimationFrame(main);
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
                draw_state(s);

                last_timestamp = timestamp;
        }

        count++;
        requestAnimationFrame(main);
}
