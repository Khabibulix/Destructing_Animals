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
// Moves cost
const MOVECOST_GUARD            =   [0 , 0 , 0 ];
const MOVECOST_RED_STRIKE       =   [10, 0 , 0 ];
const MOVECOST_BLUE_SHIELD      =   [0 , 10, 0 ];
const MOVECOST_GREEN_WARMUP     =   [0 , 0 , 10];
const MOVECOST_MAGENTA_SHOCK    =   [10, 10, 0 ];
const MOVECOST_YELLOW_LIGHTNING =   [10, 0 , 10];
const MOVECOST_CYAN_DODGE       =   [0 , 10, 10];


//////////////////////////////////////////////////////////////////////
//////////////////////////  / GLOBALS /  / ///////////////////////////
//////////////////////////////////////////////////////////////////////

// NOTHING YET

//////////////////////////////////////////////////////////////////////
//////////////////////////  / CLASSES /  / ///////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Simulating a market where a player can buy its moves.
 */
class Fighter_Market
{
    constructor()
    {

    }
    canIBuyThat(player, move) // Return True if the player can buy it, False otherwise.
    {
        switch (move) {
            case MOVE_GUARD: return true;
            case MOVE_RED_STRIKE:
            if
            (
                player.money[0] >= MOVECOST_RED_STRIKE[0]
                ||
                player.money[1] >= MOVECOST_RED_STRIKE[1] + 40
                ||
                player.money[2] >= MOVECOST_RED_STRIKE[2] + 20
            ) return true; break;
            case MOVE_BLUE_SHIELD:
            if
            (
                player.money[0] >= MOVECOST_BLUE_SHIELD[0] + 20
                ||
                player.money[1] >= MOVECOST_BLUE_SHIELD[1]
                ||
                player.money[2] >= MOVECOST_BLUE_SHIELD[2] + 40
            ) return true; break;
            case MOVE_GREEN_WARMUP:
            if
            (
                player.money[0] >= MOVECOST_GREEN_WARMUP[0] + 40
                ||
                player.money[1] >= MOVECOST_GREEN_WARMUP[1] + 20
                ||
                player.money[2] >= MOVECOST_GREEN_WARMUP[2]
            ) return true; break;
            case MOVE_MAGENTA_SHOCK:
            if
            (
                player.money[0] >= MOVECOST_MAGENTA_SHOCK[0]
                &&
                player.money[1] >= MOVECOST_MAGENTA_SHOCK[1]
                &&
                player.money[2] >= MOVECOST_MAGENTA_SHOCK[2]
            ) return true; break;
            case MOVE_YELLOW_LIGHTNING:
            if
            (
                player.money[0] >= MOVECOST_YELLOW_LIGHTNING[0]
                &&
                player.money[1] >= MOVECOST_YELLOW_LIGHTNING[1]
                &&
                player.money[2] >= MOVECOST_YELLOW_LIGHTNING[2]
            ) return true; break;
            case MOVE_CYAN_DODGE:
            if
            (
                player.money[0] >= MOVECOST_CYAN_DODGE[0]
                &&
                player.money[1] >= MOVECOST_CYAN_DODGE[1]
                &&
                player.money[2] >= MOVECOST_CYAN_DODGE[2]
            ) return true; break;
            default:
                false;
            }
            return false;
        }
}


/**
 * Player's character in Fighter mode
 * @constructor
 * @param {Number} countRed - The ammount of red collected.
 * @param {Number} countBlue - The ammount of blue collected.
 * @param {Number} countGreen - The ammount of green collected.
 * @param {Number} health - Current health (Default = 100)
 */
class Fighter_Player
{
    constructor(health=100, countRed=0, countBlue=0, countGreen=0)
    {
        this.money = [countRed, countBlue, countGreen]; // Used to calculate the whole cost.
        // Color count
        this.health = health;
        this.attack = countRed;
        this.defense = countBlue;
        this.speed = countGreen;
        this.moveList = []; // Array of Move object.
    }
    addMove(move)
    {
        this.moveList.push(move); 
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

var market = new Fighter_Market();
var mymove = new Fighter_Move(MOVE_GUARD);
var player = new Fighter_Player(100, 100, 100, 100);
var opponent = new Fighter_Player(100, 100, 100, 100);


//////////////////////////////////////////////////////////////////////
////////////////////  / INPUT MANAGEMENT /  / ////////////////////////
//////////////////////////////////////////////////////////////////////

document.addEventListener("keydown", none, false);
function none(){};

//////////////////////////////////////////////////////////////////////
///////////////////////  / GAME FUNCTIONS /  / ///////////////////////
//////////////////////////////////////////////////////////////////////

function fighterProcess()
{

}

function fighterDraw() // Dirty way
{
    //// CLEAN
    CTX.clearRect(0,0, CANVAS.width, CANVAS.height);
    //// BACKGROUND
    CTX.fillStyle = "white";
    CTX.fillRect(0,0, CANVAS.width, CANVAS.height);
    //// ELEMENT
    CTX.fillStyle = "black";
    CTX.fillRect(CANVAS.width*0.33,0,1,CANVAS.height); // Left pannel
    CTX.fillRect(
        CANVAS.width*0.33,
        CANVAS.height*0.2,
        CANVAS.width,
        1
    ); // UP right pannel
    CTX.fillRect(
        CANVAS.width*0,
        CANVAS.height*0.8,
        CANVAS.width,
        1
    ); // Bottom right pannel
    //// MOVELIST
    CTX.font = "30px Arial";
    CTX.fillText("MOVES", CANVAS.width*0.1, CANVAS.height*0.05);
    CTX.fillText("GEMS", CANVAS.width*0.1, CANVAS.height*0.9);
    CTX.fillText("MOVELIST", CANVAS.width*0.6, CANVAS.height*0.1);
    CTX.fillText("MOVELIST", CANVAS.width*0.6, CANVAS.height*0.9);
    CTX.fillStyle = "red";
    CTX.fillText("Red Strike", CANVAS.width*0.05, 100);
    CTX.fillStyle = "blue";
    CTX.fillText("Blue Shield", CANVAS.width*0.05, 150);
    CTX.fillStyle = "green";
    CTX.fillText("Green Warm-up", CANVAS.width*0.05, 200);
    CTX.fillStyle = "magenta";
    CTX.fillText("Magenta Shock", CANVAS.width*0.05, 250);
    CTX.fillStyle = "yellow";
    CTX.fillText("Yellow Lightning", CANVAS.width*0.05, 300);
    CTX.fillStyle = "cyan";
    CTX.fillText("Cyan Dodge", CANVAS.width*0.05, 350);
    CTX.fillStyle = "black";
    CTX.fillText("DONE", CANVAS.width*0.05, 400);
    //// PLAYERS
    // P1
    CTX.fillStyle = "black";
    CTX.fillRect(CANVAS.width*0.5,CANVAS.height*0.5,100,100);
    CTX.fillRect(CANVAS.width*0.48,CANVAS.height*0.35,150,10);
    CTX.fillStyle = "red";
    CTX.fillRect(CANVAS.width*0.48,CANVAS.height*0.38,150,10);
    CTX.fillStyle = "blue";
    CTX.fillRect(CANVAS.width*0.48,CANVAS.height*0.41,150,10);
    CTX.fillStyle = "green";
    CTX.fillRect(CANVAS.width*0.48,CANVAS.height*0.44,150,10);
    // P2
    CTX.fillStyle = "black";
    CTX.fillRect(CANVAS.width*0.7,CANVAS.height*0.5,100,100);
    CTX.fillRect(CANVAS.width*0.68,CANVAS.height*0.35,150,10);
    CTX.fillStyle = "red";
    CTX.fillRect(CANVAS.width*0.68,CANVAS.height*0.38,150,10);
    CTX.fillStyle = "blue";
    CTX.fillRect(CANVAS.width*0.68,CANVAS.height*0.41,150,10);
    CTX.fillStyle = "green";
    CTX.fillRect(CANVAS.width*0.68,CANVAS.height*0.44,150,10);
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