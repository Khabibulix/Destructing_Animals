//////////////////////////////////////////////////////////////////////
////////////////////////  / CANVAS INIT /  / /////////////////////////
//////////////////////////////////////////////////////////////////////

const CANVAS = document.getElementById("game");
const CTX = CANVAS.getContext("2d"); // Context, to use to draw in

//////////////////////////////////////////////////////////////////////
/////////////////////////  / CONSTANTS /  / //////////////////////////
//////////////////////////////////////////////////////////////////////

const TILE_SIZE = 64;
const WINDOW_WIDTH = CANVAS.width;
const WINDOW_HEIGHT = CANVAS.height;
const WINDOW_X_CENTER = CANVAS.width / 2;
const WINDOW_Y_CENTER = CANVAS.height / 2;

// Moves
const MOVE_GUARD            =   0;
const MOVE_RED_STRIKE       =   1;
const MOVE_BLUE_SHIELD      =   2;
const MOVE_GREEN_WARMUP     =   3;
const MOVE_MAGENTA_SHOCK    =   4;
const MOVE_YELLOW_LIGHTNING =   5;
const MOVE_CYAN_DODGE       =   6;

//////////////////////////////////////////////////////////////////////
//////////////////////////  / GLOBALS /  / ///////////////////////////
//////////////////////////////////////////////////////////////////////

// NOTHING YET

//////////////////////////////////////////////////////////////////////
//////////////////////////  / CLASSES /  / ///////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Player's character in Fighter mode
 * @constructor
 * @param {Number} countRed - The ammount of red collected.
 * @param {Number} countBlue - The ammount of blue collected.
 * @param {Number} countGreen - The ammount of green collected.
 */
class Fighter_Player
{
    constructor(countRed, countBlue, countGreen)
    {
        // Color count
        this.health = 100;
        this.attack = countRed;
        this.defense = countBlue;
        this.speed = countGreen;
        this.moveList = []; // List of Move object.
    }
}

/**
 * A fighting move
 * @constructor
 * @param {Number} move - The id of the move to play.
 */
class Fighter_Move
{
    constructor(move)
    {
        this.move = move;
    }
}


//////////////////////////////////////////////////////////////////////
///////////////////////  / OBJECTS INIT /  / /////////////////////////
//////////////////////////////////////////////////////////////////////

var player = new Platformer_Player(0,0,0);
var testmap = new Tilemap();
var mymove = new Fighter_Move(MOVE_GUARD);


//////////////////////////////////////////////////////////////////////
////////////////////  / INPUT MANAGEMENT /  / ////////////////////////
//////////////////////////////////////////////////////////////////////

document.addEventListener("keydown", eventManager, false);
function eventManager(event)
{
    if (event.key == "ArrowUp"){
        player.jump();
    }
}

//////////////////////////////////////////////////////////////////////
///////////////////////  / GAME FUNCTIONS /  / ///////////////////////
//////////////////////////////////////////////////////////////////////

function fighterProcess()
{

}

function fighterDraw()
{
    CTX.clearRect(0,0, CANVAS.width, CANVAS.height);
    CTX.strokeRect(0, 0, 50, 50);

}

function fighterGameloop()
{
    fighterProcess();
    fighterDraw();
    requestAnimationFrame(fighterGameloop);
}

//////////////////////////////////////////////////////////////////////
////////////////////////////  / MAIN /  / ////////////////////////////
//////////////////////////////////////////////////////////////////////

function main() // Gameloop
{
    fighterGameloop();
    return;
}

main();