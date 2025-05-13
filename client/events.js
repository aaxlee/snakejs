import { WIDTH, HEIGHT, socket, canvas_container,
        title_screen, join_button, vote_button
} from "./constants.js";
import { state, id, player_index } from "./sockets.js";

window.addEventListener("keydown", (e) => {
        e.preventDefault();
        socket.emit("client_event", e.key.toLowerCase(), id);
});

join_button.addEventListener("click", () => {
        title_screen.style.display = "none";
        canvas_container.style.display = "flex";

        socket.emit("join_game", WIDTH, HEIGHT);
});

vote_button.addEventListener("click", () => {
	socket.emit("player_vote");
	vote_button.disabled = true;
});
