import { s, id, player_index } from "./main.js";
import { ctx, WIDTH, HEIGHT, grid_size } from "./constants.js";

export function draw_grid()
{
        for (let y = 0; y < HEIGHT; y += s.grid_size) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(WIDTH, y);
                ctx.stroke();
        }
        for (let x = 0; x < WIDTH; x += s.grid_size) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, HEIGHT);
                ctx.line_width = 10;
                ctx.stroke();
        }
}

export function draw_food()
{
        s.food.forEach((food) => {
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.fillRect(food.x, food.y, s.grid_size, s.grid_size);
                ctx.stroke();
        });
}

function draw_player(player)
{
        ctx.beginPath();
        ctx.fillStyle = player.color;
        ctx.fillRect(player.pos.x, player.pos.y, s.grid_size, s.grid_size);
        player.tail.forEach((tail) => {
                ctx.fillRect(tail.x, tail.y, s.grid_size, s.grid_size);
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
