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
        return p;
}

module.exports = {
        create_player
}
