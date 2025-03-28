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
                        /*
                        { x: 50, y: 0, dir: {}, entity_type: "tail" },
                        { x: 100, y: 0, dir: {}, entity_type: "tail" },
                        { x: 150, y: 0, dir: {}, entity_type: "tail" }
                        */
                ],
                color: color,
                socket_id: socket_id,
                connected: 1,
                entity_type: "player"
        };
        return p;
}

module.exports = {
        create_player
}
