const WIDTH = 900;
const HEIGHT = 450

let state = {
        players: [],
        food: [],
        grid_size: 50,
        width: WIDTH,
        height: HEIGHT,
}

let map = [];

function warp_snakes()
{
        state.players.forEach((player) => {
                if (player.pos.x < 0) {
                        player.pos.x = state.width - state.grid_size;
                } else if (player.pos.x > state.width - state.grid_size) {
                        player.pos.x = 0;
                } else if (player.pos.y < 0) {
                        player.pos.y = state.height - state.grid_size;
                } else if (player.pos.y > state.height - state.grid_size) {
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
                        map[y][x] = {
                                occupants: [],
                                is_occupied: 0
                        };
                }
        }

        state.food.forEach((food) => {
                map[food.y / state.grid_size][food.x / state.grid_size].is_occupied = 1;
                map[food.y / state.grid_size][food.x / state.grid_size].occupants.push(food);

        });

        state.players.forEach((player) => {
                map[player.pos.y / state.grid_size][player.pos.x / state.grid_size].is_occupied = 1;
                map[player.pos.y / state.grid_size][player.pos.x / state.grid_size].occupants.push(player);

                player.tail.forEach((tail) => {
                        map[tail.y / state.grid_size][tail.x / state.grid_size].is_occupied = 1;
                        map[tail.y / state.grid_size][tail.x / state.grid_size].occupants.push(tail);
                });
        });
}

function generate_food()
{
        const rows = state.height / state.grid_size;
        const cols = state.width / state.grid_size;

        let x = Math.floor(Math.random() * cols);
        let y = Math.floor(Math.random() * rows);

        const start_x = x;
        const start_y = y;
        let free_cell = 1;
        while (map[y][x].is_occupied) {
                if (x == start_x && y == start_y) {
                        free_cell = 0;
                        break;
                }
                y = (y + 1) % rows;
                while (map[y][x].is_occupied) {
                        x = (x + 1) % cols;
                }
        }

        if (free_cell) {
                state.food.push({
                        x: x * state.grid_size,
                        y: y * state.grid_size,
                        entity_type: "food"
                });
        }
}

function check_collision()
{
        const rows = state.height / state.grid_size;
        const cols = state.width / state.grid_size;

        for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                        if (!map[y][x].is_occupied) {
                                continue;
                        }
                        
                        // shit code fix later
                        if (map[y][x].occupants.length != 2) {
                                continue;
                        }

                        if (map[y][x].occupants[0].entity_type == "food" &&
                            map[y][x].occupants[1].entity_type == "player") {

                                state.food = state.food.filter((food) => food != map[y][x].occupants[0]);
                                continue;
                        }

                }
        }
}

module.exports = {
        state,
        map,
        update_snakes,
        update_map,
        warp_snakes,
        generate_food,
        check_collision
}
