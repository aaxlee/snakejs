import { socket } from "./constants.js";
import { s, id, player_index } from "./main.js";

window.addEventListener("keydown", (e) => {
        e.preventDefault();
        socket.emit("client_event", e.key.toLowerCase(), id);
});
