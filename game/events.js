function reset_direction(player)
{
        player.dir.left = false;
        player.dir.right = false;
        player.dir.up = false;
        player.dir.down = false;
}

function process_event(e, player)
{
        switch (e) {
                case 'w':
                        reset_direction(player);
                        player.dir.up = true;
                        break;
                case 'a':
                        reset_direction(player);
                        player.dir.left = true;
                        break;
                case 's':
                        reset_direction(player);
                        player.dir.down = true;
                        break;
                case 'd':
                        reset_direction(player);
                        player.dir.right = true;
                        break;
                default:
                        break;
        }
}

module.exports = {
        process_event
};
