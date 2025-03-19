const grid_size = 50;

function create_player(state, socket_id, color)
{
        let p = {
                id: state.players.length,
                pos: { x: 0, y: 0 },
                dir: {
                        left: false,
                        right: false,
                        up: false,
                        down: false
                },
                tail: [
                        { x: -50, y: 0 },
                        { x: -100, y: 0 },
                        { x: -150, y: 0 }
                ],
                color: color,
                socket_id: socket_id,
                connected: 1,
        };
        state.players.push(p);
        return p;
}

function update_snakes(state)
{
        for (let i = 0; i < state.players.length; i++) {
                let prev = { ...state.players[i].pos };
                if (state.players[i].dir.up) {
                        state.players[i].pos.y -= grid_size;
                } else if (state.players[i].dir.down) {
                        state.players[i].pos.y += grid_size;
                } else if (state.players[i].dir.left) {
                        state.players[i].pos.x -= grid_size;
                } else if (state.players[i].dir.right) {
                        state.players[i].pos.x += grid_size;
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

module.exports = {
        create_player,
        update_snakes
}
