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
	state.players.forEach(player => {
		player.warp({
			height: state.height,
			width: state.width,
			grid_size: state.grid_size
		});
	});
}

function update_snakes()
{
	state.players.forEach(player => {
		player.update_snake(state.grid_size);
	});
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
                        let occupants = map[y][x].occupants;
                        let player = occupants.find(o => o.entity_type === "player");
                        let tail = occupants.find(o => o.entity_type === "tail");
                        let food = occupants.find(o => o.entity_type === "food");

                        if (player && food) {
				player.extend_tail(state.grid_size);
                                let index = state.food.indexOf(food);
                                state.food.splice(index, 1);
                        } else if (player && tail) {
                                let colliding_player;
                                state.players.forEach(p => {
                                        if (p.socket_id === tail.parent_id) {
                                                colliding_player = p;
                                        }
                                });

                                let index = colliding_player.tail.indexOf(tail);
                                if (index !== -1) {
                                        colliding_player.tail.splice(index);
                                } 
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
