const WIDTH = 1024;
const HEIGHT = 512; 

let state = {
	over: 0,
	restart_votes: 0,
        players: [],
        food: [],
        grid_size: 32,
        width: WIDTH,
        height: HEIGHT,
	food_cooldown: 64
}

let map = [];

function handle_borders()
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
                        player.prev_pos = { x: player.pos.x, y: player.pos.y };
			player.update_snake(state.grid_size);
		}
	});
}

// iterates over all entities and adds it to the 2d array 'map'
function update_map()
{
        const rows = state.height / state.grid_size;
        const cols = state.width / state.grid_size;

        // initialize map as an empty 2d array
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
                                if (tail.y >= 0 && tail.y < state.height && 
                                    tail.x >= 0 && tail.x < state.width) {
                                        map[tail.y / state.grid_size][tail.x / state.grid_size].is_occupied = 1;
                                        map[tail.y / state.grid_size][tail.x / state.grid_size].occupants.push(tail);
                                }
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

function kill_player(player)
{
        player.is_alive = 0;
        // iterate over the tail and remove it from the map
        player.tail.forEach(tail => {
                const map_x = tail.x / state.grid_size;
                const map_y = tail.y / state.grid_size;
                const cell = map[map_y][map_x];
                let index = cell.occupants.findIndex(o => o.entity_type === "tail");
                if (index !== -1) {
                        cell.occupants.splice(index, 1);
                }
        });
}

function check_headon_collision()
{
        for (let i = 0; i < state.players.length; i++) {
                for (let j = i + 1; j < state.players.length; j++) {
                        const p1 = state.players[i];
                        const p2 = state.players[j];

                        if (!p1.is_alive || !p2.is_alive) continue;

                        // detect swap-past or meet-in-middle head-on
                        const dx1 = p1.pos.x - p1.prev_pos.x;
                        const dy1 = p1.pos.y - p1.prev_pos.y;
                        const dx2 = p2.pos.x - p2.prev_pos.x;
                        const dy2 = p2.pos.y - p2.prev_pos.y;

                        // swap
                        const swapped = 
                            p1.pos.x === p2.prev_pos.x &&
                            p1.pos.y === p2.prev_pos.y &&
                            p2.pos.x === p1.prev_pos.x &&
                            p2.pos.y === p1.prev_pos.y;

                        // meet-in-middle
                        const same_cell = p1.pos.x === p2.pos.x && p1.pos.y === p2.pos.y;
                        const opposite_dirs = dx1 === -dx2 && dy1 === -dy2;

                        if (swapped || (same_cell && opposite_dirs)) {
                                if (p1.tail.length === p2.tail.length) {
                                        kill_player(p1);
                                        kill_player(p2);
                                } else if (p1.tail.length > p2.tail.length) {
                                        kill_player(p2);
                                } else {
                                        kill_player(p1);
                                }
                        }
                }
        }
}

// iterates over all players, and checks if the current cell is occupied by other entities
function check_collision()
{
        for (let i = 0; i < state.players.length; i++) {
                let player = state.players[i];
                const map_x = player.pos.x / state.grid_size;
                const map_y = player.pos.y / state.grid_size;

                if (!map[map_y][map_x].is_occupied) continue;
                let occupants = map[map_y][map_x].occupants;

                let players = occupants.filter(o => o.entity_type === "player" && o.is_alive);
                let tail = occupants.find(o => o.entity_type === "tail");
                let food = occupants.find(o => o.entity_type === "food");

                if (players.length > 0 && food) {
                        // if a player is on the same cell as food
                        players[0].extend_tail(state.grid_size);
                        let index = state.food.indexOf(food);
                        state.food.splice(index, 1);
                        generate_food();
                } else if (players.length === 2) {
                        // if two players are on the same cell
                        let weaker = players.find(p => p.tail.length < 1);
                        let stronger = players.find(p => p.tail.length > 0);

                        if (!weaker || !stronger) continue;
                        if (weaker && stronger) {
                                weaker.is_alive = 0;
                        }

                        const p1 = players[0];
                        const p2 = players[1];

                        if (p1.tail.length < p2.tail.length) {
                                kill_player(p1);
                        } else if (p1.tail.length > p2.tail.length) {
                                kill_player(p2);
                        } else {
                                kill_player(p1);
                                kill_player(p2);
                        }

                } else if (players.length > 0 && tail) {
                        // if a player is on the same cell as a tail
                        let colliding_player = state.players.find(p => p.socket_id === tail.parent_id);

                        let tail_index = colliding_player.tail.findIndex(t => t.x === tail.x && t.y === tail.y);
                        if (tail_index !== -1) {
                                colliding_player.tail.splice(tail_index);
                        }
                }
        }
}

// checks if any player has lost their tail
function exists_weak_player()
{
        for (let i = 0; i < state.players.length; i++) {
                if (state.players[i].tail.length < 1) {
                        return 1;
                }
        }
        return 0;
}

function is_game_over()
{
	let alive_counter = 0;
	state.players.forEach(player => {
		if (player.is_alive) {
			alive_counter++;
		}
	});
	if (alive_counter === 1 && state.players.length > 1 ||
            alive_counter === 0 && state.players.length > 1) {
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
                player.extend_tail(state.grid_size);
                player.extend_tail(state.grid_size);
	});
	state.over = 0;
	state.restart_votes = 0;
	state.food = [];
	update_map();
}

module.exports = {
	is_game_over,
	reset,
        state,
        exists_weak_player,
        map,
        update_snakes,
        update_map,
        handle_borders,
        generate_food,
        check_headon_collision,
        check_collision
}
