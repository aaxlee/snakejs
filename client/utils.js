import { s, player_index } from "./client.js";

export function reset_directions()
{
        s.players[player_index].dir.left = false;
        s.players[player_index].dir.right = false;
        s.players[player_index].dir.up = false;
        s.players[player_index].dir.down = false;
}
