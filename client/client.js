var socket = io("http://10.32.45.162:3000");

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
const grid_size = 50;

let s;
let p;
let id;
let player_index;

let last_timestamp = 0;

socket.on("game_init", (player, state, socket_id, index) => {
        console.log(player);
        p = player;
        s = state;
        id = socket_id;
        player_index = index;
        requestAnimationFrame(main);
});

socket.on("server_upd", (state) => {
        s = state;
});

function reset_directions()
{
        s.players[player_index].dir.left = false;
        s.players[player_index].dir.right = false;
        s.players[player_index].dir.up = false;
        s.players[player_index].dir.down = false;
}

window.addEventListener("keydown", (e) => {
        e.preventDefault();
        switch (e.key.toLowerCase()) {
                case "w":
                        reset_directions()
                        s.players[player_index].dir.up = true;
                        break;
                case "a":
                        reset_directions();
                        s.players[player_index].dir.left = true;
                        break;
                case "s":
                        reset_directions();
                        s.players[player_index].dir.down = true;
                        break;
                case "d":
                        reset_directions();
                        s.players[player_index].dir.right = true;
                        break;
                default:
                        break;
        }
});

function draw_grid()
{
        for (let y = 0; y < c.height; y += grid_size) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(c.width, y);
                ctx.stroke();
        }
        for (let x = 0; x < c.width; x += grid_size) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, c.height);
                ctx.line_width = 10;
                ctx.stroke();
        }
}

function draw_player(player)
{
        ctx.beginPath();
        ctx.rect(player.pos.x, player.pos.y, 50, 50);
        ctx.stroke();

}

function draw_state(state)
{
        state.players.forEach((player) => {
                draw_player(player);
        });
}


const TARGET_FPS = 30;
const frame_time = 1000 / TARGET_FPS; // Time per frame in milliseconds
let last_frame_time = 0;

let count = 0;
function main(timestamp)
{
        let dtime = timestamp - last_frame_time;

        if (dtime >= frame_time) { 
                last_frame_time = timestamp;

                if (last_timestamp > 0) {
                        let delta = (timestamp - last_timestamp) / 1000;
                        fps = 1 / delta;
                }
                last_timestamp = timestamp;

                // Game loop
                if (count >= 15) {
                        socket.emit("client_upd", s, id);
                        count = 0;
                }
                ctx.clearRect(0, 0, 900, 450);
                draw_grid();
                draw_state(s);
        }

        count++;
        requestAnimationFrame(main);
}
