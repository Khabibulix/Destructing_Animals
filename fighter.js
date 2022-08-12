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
    /* Free */
const MOVECOST_GUARD            =   [0 , 0 , 0 ];
    /* Pure */
const MOVECOST_RED_STRIKE       =   [10, 0 , 0 ];
const MOVECOST_BLUE_SHIELD      =   [0 , 10, 0 ];
const MOVECOST_GREEN_WARMUP     =   [0 , 0 , 10];
    /* Hybrid with alternative costs */
const MOVECOST_MAGENTA_SHOCK0   =   [10, 10, 0 ]; // Classic
const MOVECOST_MAGENTA_SHOCK1   =   [0 , 10, 20]; // Split 30
const MOVECOST_MAGENTA_SHOCK2   =   [30 ,0 , 0 ]; // 30
const MOVECOST_MAGENTA_SHOCK3   =   [20, 0 , 20]; // 40
/**/
const MOVECOST_YELLOW_LIGHTNING0=   [10, 0 , 10]; // Classic
const MOVECOST_YELLOW_LIGHTNING1=   [10, 20, 0 ]; // Split 30
const MOVECOST_YELLOW_LIGHTNING2=   [0 , 0 , 30]; // 30
const MOVECOST_YELLOW_LIGHTNING3=   [0 , 20, 20]; // 40
/**/
const MOVECOST_CYAN_DODGE0      =   [0 , 10, 10]; // Classic
const MOVECOST_CYAN_DODGE1      =   [20, 0 , 10]; // Split 30
const MOVECOST_CYAN_DODGE2      =   [0 , 30, 0 ]; // 30
const MOVECOST_CYAN_DODGE3      =   [20, 20, 0 ]; // 40


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
    /**
     * Checks if the chosen pure move can be bought by a player.
     * @param {Fighter_Player} player Player.
     * @param {Number[]} movecost Array of 3 Number representing the cost of the move.
     * @param {Number} r Red "conversion tax" (Default = 0).
     * @param {Number} b Blue "conversion tax" (Default = 0).
     * @param {Number} g Green "conversion tax" (Default = 0).
     * @returns True if the player can buy it, False otherwise.
     */
    checkPureMoveCost(player, movecost, r=0, b=0, g=0)
    {
        if
        (
            player.money[0] >= movecost[0] + r
            ||
            player.money[1] >= movecost[1] + b
            ||
            player.money[2] >= movecost[2] + g
        ) return true;
        return false;
    }
    /**
     * Checks if the chosen hybrid move can be bought by a player.
     * @param {Fighter_Player} player Player.
     * @param {Number[]} movecost Array of 3 Number representing the cost of the move.
     * @returns True if the player can buy it, False otherwise.
     */
    checkHybridMoveCost(player, movecost)
    {
        if
        (
            player.money[0] >= movecost[0]
            &&
            player.money[1] >= movecost[1]
            &&
            player.money[2] >= movecost[2]
        ) return true;
        return false;
    }
    /**
     * Checks if the chosen move can be bought by a player.
     * @param {Fighter_Player} player Player.
     * @param {Number} move Move ID.
     * @returns True if the player can buy it, False otherwise. 
     */
    canIBuyThat(player, move) //
    {
        switch (move) {
            case MOVE_GUARD: return true;
            case MOVE_RED_STRIKE: return this.checkPureMoveCost(player, MOVECOST_RED_STRIKE, 0, 40,20);
            case MOVE_BLUE_SHIELD: return this.checkPureMoveCost(player, MOVECOST_BLUE_SHIELD, 20, 0, 40);
            case MOVE_GREEN_WARMUP: return this.checkPureMoveCost(player, MOVECOST_GREEN_WARMUP, 40, 20, 0);
            case MOVE_MAGENTA_SHOCK:
            if
            (
                this.checkHybridMoveCost(player, MOVECOST_MAGENTA_SHOCK0)
                ||
                this.checkHybridMoveCost(player, MOVECOST_MAGENTA_SHOCK1)
                ||
                this.checkHybridMoveCost(player, MOVECOST_MAGENTA_SHOCK2)
                ||
                this.checkHybridMoveCost(player, MOVECOST_MAGENTA_SHOCK3)
            ) return true; break;
            case MOVE_YELLOW_LIGHTNING:
            if
            (
                this.checkHybridMoveCost(player, MOVECOST_YELLOW_LIGHTNING0)
                ||
                this.checkHybridMoveCost(player, MOVECOST_YELLOW_LIGHTNING1)
                ||
                this.checkHybridMoveCost(player, MOVECOST_YELLOW_LIGHTNING2)
                ||
                this.checkHybridMoveCost(player, MOVECOST_YELLOW_LIGHTNING3)
            ) return true; break;
            case MOVE_CYAN_DODGE:
            if
            (
                this.checkHybridMoveCost(player, MOVECOST_CYAN_DODGE0)
                ||
                this.checkHybridMoveCost(player, MOVECOST_CYAN_DODGE1)
                ||
                this.checkHybridMoveCost(player, MOVECOST_CYAN_DODGE2)
                ||
                this.checkHybridMoveCost(player, MOVECOST_CYAN_DODGE3)
            ) return true; break;
            default: break;
        }
        return false;
    }
    /**
     * Allows a player to buy a move if it has the ressources.
     * @param {Fighter_Player} player Player.
     * @param {Number} move Move ID.
     * @returns Nothing.
     */
    buy(player, move)
    {
        if(this.canIBuyThat(player, move)){ // Just in case, but it is supposed to be already checked before the call.
            // TODO : get the cost and make the player pay it.
            player.addMove(move);
        }
    }
}


/**
 * Player's character in Fighter mode
 * @constructor
 * @param {Number} health - Current health (Default = 100).
 * @param {Number} countRed - The amount of red collected (Default = 0).
 * @param {Number} countBlue - The amount of blue collected (Default = 0).
 * @param {Number} countGreen - The amount of green collected (Default = 0).
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
        this.moveArray = []; // Array of move.
    }
    /**
     * Adds a move to the array of move.
     * @param {Number} move Move ID. 
     */
    addMove(move)
    {
        this.moveArray.push(move); 
    }
}

//////////////////////////////////////////////////////////////////////
///////////////////////  / OBJECTS INIT /  / /////////////////////////
//////////////////////////////////////////////////////////////////////

var market = new Fighter_Market();
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