var socket = io();

var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

let s;
let p;
let id;

socket.on("game_init", function (player, state, socket_id) {
        console.log(player);
        p = player;
        s = state;
        id = socket_id;
        requestAnimationFrame(main);
});

socket.on("server_upd", (state) => {
        s = state;
        draw_state(state);
});

window.addEventListener("keydown", (e) => {
        e.preventDefault();
        switch (e.key.toLowerCase()) {
                case "w":
                        p.pos.y -= 10;
                        break;
                case "a":
                        p.pos.x -= 10;
                        break;
                case "s":
                        p.pos.y += 10;
                        break;
                case "d":
                        p.pos.x += 10;
                        break;
        }
        socket.emit("client_upd", p);
});

function draw_player(player)
{
        ctx.beginPath();
        ctx.rect(player.pos.x, player.pos.y, 50, 50);
        ctx.stroke();

}

function draw_state(state)
{
        for (let i = 0; i < state.players.length; i++) {
                draw_player(state.players[i]);
        }
}

function main(timestamp)
{
        ctx.clearRect(0, 0, 900, 450);
        draw_state(s);
        requestAnimationFrame(main);
}
