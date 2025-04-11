const WIDTH = 900;
const HEIGHT = 450

let state = {
	over: 0,
	restart_votes: 0,
        players: [],
        food: [],
        grid_size: 50,
        width: WIDTH,
        height: HEIGHT,
	food_threshold: 15
}

let map = [];

function warp_snakes()
{
	state.players.forEach(player => {
		if (player.is_alive) {
			player.warp({
				height: state.height,
				width: state.width,
				grid_size: state.grid_size
			});
		}
	});
}

function update_snakes()
{
	state.players.forEach(player => {
		if (player.is_alive) {
			player.update_snake(state.grid_size);
		}
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
		if (player.is_alive) {
			map[player.pos.y / state.grid_size][player.pos.x / state.grid_size].is_occupied = 1;
			map[player.pos.y / state.grid_size][player.pos.x / state.grid_size].occupants.push(player);

			player.tail.forEach((tail) => {
				map[tail.y / state.grid_size][tail.x / state.grid_size].is_occupied = 1;
				map[tail.y / state.grid_size][tail.x / state.grid_size].occupants.push(tail);
			});
		}
        });
}

function get_empty_coord()
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
		return { x: x, y: y };
	} else {
		return null;
	}
}

function generate_food()
{
	let coord = get_empty_coord();

        if (coord != null) {
                state.food.push({
                        x: coord.x * state.grid_size,
                        y: coord.y * state.grid_size,
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

                        let players = occupants.filter(o => o.entity_type === "player");
                        let tails = occupants.filter(o => o.entity_type === "tail");
                        let food = occupants.find(o => o.entity_type === "food");

                        if (players.length > 0 && food) {
				players[0].extend_tail(state.grid_size);
                                let index = state.food.indexOf(food);
                                state.food.splice(index, 1);
				generate_food();
                        } else if (players.length > 0 && tails.length > 0) {
                                let colliding_player;
				tails.forEach(tail => {
					state.players.forEach(p => {
						if (p.socket_id === tail.parent_id) {
							colliding_player = p;
						}
					});

					let index = colliding_player.tail.indexOf(tail);
					if (index !== -1) {
						colliding_player.tail.splice(index);
					} 
				});
                        } else if (players.length > 1) {
				let weaker = players.find(p => p.tail.length < 1);
				let stronger = players.find(p => p.tail.length > 0);
				if (weaker && stronger) {
					weaker.is_alive = 0;
				}
			}
                }
        }
}

function is_game_over()
{
	let alive_counter = 0;
	state.players.forEach(player => {
		if (player.is_alive && state.players.length > 1) {
			alive_counter++;
		}
	});
	if (alive_counter === 1) {
		state.over = 1;
	}
}

function reset()
{
	state.players.forEach(player => {
		let new_position = get_empty_coord();
		new_position.x *= state.grid_size;
		new_position.y *= state.grid_size;
		player.reset(new_position);
	});
	state.over = 0;
	state.restart_votes = 0;
	state.food = [];
	update_map();
	console.log("here");
	console.log(state);
}

module.exports = {
	is_game_over,
	reset,
        state,
        map,
        update_snakes,
        update_map,
        warp_snakes,
        generate_food,
        check_collision
}
