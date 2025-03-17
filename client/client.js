import { socket, WIDTH, HEIGHT, c, ctx, grid_size, TARGET_FPS, FRAME_TIME } from "./constants.js";
import { draw_grid, draw_player, draw_state } from "./rendering.js";
import "./events.js";

export let s;
export let p;
export let id;
export let player_index;

let last_timestamp = 0;

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

let last_frame_time = 0;
let fps;
let count = 0;
function main(timestamp)
{
        let dtime = timestamp - last_frame_time;

        if (dtime >= FRAME_TIME) { 
                last_frame_time = timestamp;

                if (last_timestamp > 0) {
                        let delta = (timestamp - last_timestamp) / 1000;
                        fps = 1 / delta;
                }
                last_timestamp = timestamp;

                // Game loop
                if (count >= 15) {
                        socket.emit("client_upd", s, id);
                        count = 0;
                }
                ctx.clearRect(0, 0, 900, 450);
                draw_grid();
                draw_state(s);
        }

        count++;
        requestAnimationFrame(main);
}
