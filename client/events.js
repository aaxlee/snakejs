import { socket } from "./constants.js";
import { s, p, id, player_index } from "./client.js";

window.addEventListener("keydown", (e) => {
        e.preventDefault();
        socket.emit("client_event", e.key.toLowerCase(), id);
});
