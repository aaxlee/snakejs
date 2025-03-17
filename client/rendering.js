import { s, p, id, player_index } from "./client.js";
import { ctx, WIDTH, HEIGHT, grid_size } from "./constants.js";
import { reset_directions } from "./utils.js";

export function draw_grid()
{
        for (let y = 0; y < HEIGHT; y += grid_size) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(WIDTH, y);
                ctx.stroke();
        }
        for (let x = 0; x < WIDTH; x += grid_size) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, HEIGHT);
                ctx.line_width = 10;
                ctx.stroke();
        }
}

export function draw_player(player)
{
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(player.pos.x, player.pos.y, 50, 50);
        player.tail.forEach((tail) => {
                ctx.fillRect(tail.x, tail.y, 50, 50);
        });
        ctx.stroke();

}

export function draw_state(state)
{
        state.players.forEach((player) => {
                if (player.connected) {
                        draw_player(player);
                }
        });
}
