import { state, id, player_index } from "./sockets.js";
import { ctx, WIDTH, HEIGHT, grid_size } from "./constants.js";

export function draw_grid()
{
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 1;
        for (let y = 0; y < HEIGHT; y += state.grid_size) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(WIDTH, y);
                ctx.stroke();
        }
        for (let x = 0; x < WIDTH; x += state.grid_size) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, HEIGHT);
                ctx.line_width = 10;
                ctx.stroke();
        }
}

export function draw_food()
{
        state.food.forEach((food) => {
                ctx.beginPath();
                ctx.fillStyle = "red";
                ctx.fillRect(food.x, food.y, state.grid_size, state.grid_size);
                ctx.stroke();
        });
}

function draw_player(player)
{
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
        ctx.shadowBlur = 5;

        ctx.fillStyle = player.color;
        ctx.fillRect(player.pos.x, player.pos.y, state.grid_size, state.grid_size);

        player.tail.forEach((tail) => {
                ctx.fillRect(tail.x, tail.y, state.grid_size, state.grid_size);
        });
        ctx.stroke();

}

export function draw_state(state)
{
        state.players.forEach((player) => {
                if (player.connected && player.is_alive) {
                        draw_player(player);
                }
        });
}

export function draw_death_screen()
{
	ctx.font = "48px serif";
	ctx.fillText("YOU DIED...", state.width / 2, state.height / 2);
}

export function draw_end_screen()
{
	ctx.font = "48px serif";
	ctx.fillText("GAME OVER!!!", 300, 200);
}
