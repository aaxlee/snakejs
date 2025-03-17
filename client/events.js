import { s, p, id, player_index } from "./client.js";
import { reset_directions } from "./utils.js";

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
