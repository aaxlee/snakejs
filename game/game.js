let state = {
        players: [],
        grid_size: 50
}

function warp_snakes()
{
        state.players.forEach((player) => {
                if (player.pos.x < 0) {
                        player.pos.x = 900;
                } else if (player.pos.x > 900) {
                        player.pos.x = -state.grid_size;
                } else if (player.pos.y < 0) {
                        player.pos.y = 450;
                } else if (player.pos.y > 450) {
                        player.pos.y = -state.grid_size;
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

module.exports = {
        state,
        update_snakes,
        warp_snakes
}
