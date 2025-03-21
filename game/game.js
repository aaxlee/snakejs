const WIDTH = 900;
const HEIGHT = 450

let state = {
        players: [],
        grid_size: 50,
        width: WIDTH,
        height: HEIGHT,
}

let map = [];

function warp_snakes()
{
        state.players.forEach((player) => {
                if (player.pos.x < 0) {
                        player.pos.x = state.width;
                } else if (player.pos.x > state.width) {
                        player.pos.x = 0;
                } else if (player.pos.y < 0) {
                        player.pos.y = state.height;
                } else if (player.pos.y > state.height) {
                        player.pos.y = 0;
                }
        });
}

function update_snakes()
{
        for (let i = 0; i < state.players.length; i++) {
                let prev = { ...state.players[i].pos };
                if (state.players[i].dir.up) {
                        state.players[i].pos.y -= state.grid_size;
                } else if (state.players[i].dir.down) {
                        state.players[i].pos.y += state.grid_size;
                } else if (state.players[i].dir.left) {
                        state.players[i].pos.x -= state.grid_size;
                } else if (state.players[i].dir.right) {
                        state.players[i].pos.x += state.grid_size;
                } else {
                        continue;
                }

                if (state.players[i].tail.length == 0) {
                        continue;
                }

                for (let j = 0; j < state.players[i].tail.length; j++) {
                        let next = state.players[i].tail[j];
                        state.players[i].tail[j] = prev;
                        prev = next;
                }
        }
}

function update_map()
{
        const rows = state.height / state.grid_size;
        const cols = state.width / state.grid_size;
        for (let y = 0; y < rows; y++) {
                map[y] = [];
                for (let x = 0; x < cols; x++) {
                        map[y][x] = 0;
                }
        }
        state.players.forEach((player) => {
                map[player.pos.y / state.grid_size][player.pos.x / state.grid_size] = 1;
                player.tail.forEach((tail) => {
                        if (tail.x >= 0 && tail.y >= 0) {
                                map[tail.y / state.grid_size][tail.x / state.grid_size] = 1;
                        }
                });
        });
}

function generate_food()
{

}

module.exports = {
        state,
        map,
        update_snakes,
        update_map,
        warp_snakes
}
