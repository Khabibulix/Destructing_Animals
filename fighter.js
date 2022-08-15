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
////////////////////  / INPUT MANAGEMENT /  / ////////////////////////
//////////////////////////////////////////////////////////////////////

document.addEventListener("keydown", none, false);
function none(){};

class Mouse
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
    }
    listener(event)
    {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        console.log(event);
    }
    isOnScreen()
    {
        if (
            mouse.x > 0
            &&
            mouse.x < CANVAS.width
            &&
            mouse.y > 0
            &&
            mouse.y < CANVAS.height
            ) return true;
        return false;
    }
}
var mouse = new Mouse;
document.addEventListener("mousedown", mouse.listener, false);
document.addEventListener("mousemove", mouse.listener, false);

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
        this.dodge = 0; // Used by Cyan Dodge move.
    }
    /**
     * Adds a move to the array of move.
     * @param {Number} move Move ID. 
     */
    addMove(move)
    {
        this.moveArray.push(move); 
    }
    /**
     * Consumes the move (removes it from the array of move).
     */
    consumeMove()
    {
        this.moveArray.shift();
    }
    /**
     * Consumes the next move (removes it from the array of move).
     * This happens when the player get attacked with the Magenta Shock move.
     */
    getShocked()
    {
        this.moveArray.splice(1, 1);
    }
    /**
     * Player gets the ability to dodge one attack.
     */
    dodgeUp()
    {
        this.dodge += 1;
    }
    /**
     * Attack dodged !
     */
    dodgeAttack()
    {
        this.dodge -= 1;
    }
    /**
     * Can the player dodge an attack ?
     * @returns True if true... False otherwise.
     */
    canDodge()
    {
        if (this.dodge > 0) return true;
        return false;
    }
    /**
     * @returns The first move in the array.
     */
    get currentMove()
    {
        return this.moveArray[0];
    }
}

/**
 * Manages the interactions between players.
 */
class Fighter_Manager
{
    constructor()
    {
        this.turn = 0;
    }
    /**
     * Process one turn of a fight between two players.
     * @param {Fighter_Player} player1
     * @param {Fighter_Player} player2
     */
    process_turn(player1, player2)
    {
        // Charity for the moveless people.
        if (player1.currentMove == undefined) player1.addMove(MOVE_GUARD);
        if (player2.currentMove == undefined) player2.addMove(MOVE_GUARD);

        // Defending moves
        // Green Warm-up move
        if (player1.currentMove == MOVE_GREEN_WARMUP) this.play_move_green_warmup(player1);
        if (player2.currentMove == MOVE_GREEN_WARMUP) this.play_move_green_warmup(player2);
        // Cyan Dodge move 
        if (player1.currentMove == MOVE_CYAN_DODGE) this.play_move_cyan_dodge(player1);
        if (player2.currentMove == MOVE_CYAN_DODGE) this.play_move_cyan_dodge(player2);

        // Attacking move
        if (this.is_attacking(player1) && this.is_attacking(player2)) // Both players attacking (manage priority).
        {
            if (player1.speed > player2.speed)
            {
                this.process_attack(player1, player2);
                // TODO : HEALTH CHECK HERE
                this.process_attack(player2, player1);
            }
            else if (player1.speed < player2.speed)
            {
                this.process_attack(player2, player1);
                // TODO : HEALTH CHECK HERE
                this.process_attack(player1, player2);
            }
            else // Equal speed, they both attack at the same time.
            {
                this.process_attack(player2, player1);
                this.process_attack(player2, player1);
                // TODO : HEALTH CHECK HERE
            }
        }
        else if (this.is_attacking(player1) || this.is_attacking_with_guard(player1,player2)) // Only the player 1 attacking.
        {
            if (player2.canDodge()) player2.dodgeAttack();
            else
            {
                this.process_attack(player1, player2);
                // TODO : HEALTH CHECK HERE
            }
        }
        else if (this.is_attacking(player2) || this.is_attacking_with_guard(player2,player1)) // Only the player 2 attacking.
        {
            if (player1.canDodge()) player1.dodgeAttack();
            else
            {
                this.process_attack(player2, player1);
                // TODO : HEALTH CHECK HERE
            }
        }
        // Moves end
        player1.consumeMove();
        player2.consumeMove();
        // Turn end
        this.turn += 1;
    }
    /**
     * Process an attack move.
     * @param {Fighter_Player} attacker Attacking player.
     * @param {Fighter_Player} defender Defending player.
     */
    process_attack(attacker, defender)
    {
        let move = attacker.currentMove;
        console.log(move);
        switch (move) {
            case MOVE_GUARD:
                this.play_move_guard(attacker, defender);
                break;
            case MOVE_RED_STRIKE:
                this.play_move_red_strike(attacker, defender);
                break;
            case MOVE_MAGENTA_SHOCK:
                this.play_move_magenta_shock(attacker, defender);
                break;
            case MOVE_YELLOW_LIGHTNING:
                this.play_move_yellow_lightning(attacker, defender);
                break;
            default: break;
        }
    }
    /**
     * Tells if the player is currently using an attacking move.
     * @param {Fighter_Player} player 
     * @returns True if attacking, False otherwise.
     */
    is_attacking(player)
    {
        switch (player.currentMove) {
            case MOVE_RED_STRIKE:       return true;
            case MOVE_MAGENTA_SHOCK:    return true;
            case MOVE_YELLOW_LIGHTNING: return true;
            default:break
        }
        return false;
    }
    /**
     * Tells if the player is currently using the attacking part of the Guard move.
     * @param {Fighter_Player} player1 Player to check the predicate.
     * @param {Fighter_Player} player2
     * @returns True if attacking with the Guard move, False otherwise.
     */
    is_attacking_with_guard(player1, player2)
    {
        if (player1.currentMove == MOVE_GUARD && player1.speed > player2.speed)
            return true ;
        return false;
    }
    apply_capping(ammount)
    {
        return Math.max(0 , ammount);
    }
    apply_move_def(player)
    {
        switch (player.currentMove)
        {
            case MOVE_BLUE_SHIELD:  return 1.0 * player.defense;
            case MOVE_GREEN_WARMUP: return 0.75* player.defense;
            case MOVE_GUARD:        return 0.5 * player.defense;
            default:                return 0;
        }   
    }
    /**
     * Plays the attacking part of the Guard move.
     * @param {Fighter_Player} player1 Attacker.
     * @param {Fighter_Player} player2 Defender.
     */
    play_move_guard(player1, player2)
    {
        player2.health -= this.apply_capping( // Prevent gain of health if oppenent's defense is overwhelming.
            (0.5 * player1.attack) - this.apply_move_def(player2) // Reduced attack Vs Possible protection
        );
    }
    play_move_red_strike(player1, player2)
    {
        player2.health -= this.apply_capping(
            (1.0 * player1.attack) - (this.apply_move_def(player2) - 5)
        );
    }
    play_move_green_warmup(player)
    {
        player.speed = Math.min(100, player.speed + 25); // Cap the result to 100 max.
    }
    play_move_magenta_shock(player1, player2)
    {
        player2.health -= this.apply_capping(
            (0.9 * player1.attack) - (this.apply_move_def(player2) - 5)
        );
        player2.getShocked();
    }
    play_move_yellow_lightning(player1, player2)
    {
        // Plays Red Strike move twice litteraly !
        this.play_move_red_strike(player1, player2);
        this.play_move_red_strike(player1, player2);
    }
    play_move_cyan_dodge(player)
    {
        player.dodgeUp()
        player.speed = Math.min(100, player.speed + 10); // Cap the result to 100 max.
    }
}

//
class GUI_Window
{
    constructor(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    draw_curvelinker(posx, posy)
    {
        CTX.quadraticCurveTo(posx, posy, posx, posy);
    }
    /**
     * Draws a curve and links it to the next draw point (kind of moveTo).
     * @param {Number} controlx Control point x.
     * @param {Number} controly Control point y.
     * @param {Number} destx Destination point x.
     * @param {Number} desty Destination point y.
     * @param {Number} nextx Coordonate x of the next draw point.
     * @param {Number} nexty Coordonate y of the next draw point.
     */
    draw_curve(controlx, controly, destx, desty, nextx, nexty)
    {
        CTX.quadraticCurveTo(
            controlx,
            controly,
            destx,
            desty
        );
        this.draw_curvelinker(nextx,nexty);
    }
    draw()
    {
        const margin = ((this.width + this.height) / 2) * 0.1;
        const origin_x = this.x;
        const origin_y = this.y;
        const full_x = this.x + this.width;
        const full_y = this.y + this.height;
        CTX.fillStyle = "black";
        CTX.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
        CTX.fillStyle = "grey";
        CTX.beginPath();
        CTX.moveTo(origin_x, origin_y + margin);
        this.draw_curve(
            origin_x,
            origin_y,
            origin_x + margin,
            origin_y,
            full_x - margin,
            origin_y
        );
        this.draw_curve(
            full_x,
            origin_y,
            full_x,
            origin_y + margin,
            full_x,
            full_y - margin
        );
        CTX.quadraticCurveTo(
            full_x,
            full_y,
            full_x - margin,
            full_y,

        );
        this.draw_curvelinker(origin_x + margin, full_y);
        CTX.quadraticCurveTo(
            origin_x,
            full_y,
            origin_x,
            full_y - margin,
        );
        this.draw_curvelinker(origin_x, origin_y + margin);
        CTX.fill();
    }
}

//////////////////////////////////////////////////////////////////////
///////////////////////  / OBJECTS INIT /  / /////////////////////////
//////////////////////////////////////////////////////////////////////

var market = new Fighter_Market();
var player = new Fighter_Player(100, 95, 95, 75);
var opponent = new Fighter_Player(100, 100, 100, 100);
var manager = new Fighter_Manager;
//
player.addMove(MOVE_RED_STRIKE);
opponent.addMove(MOVE_CYAN_DODGE);
player.addMove(MOVE_RED_STRIKE);
opponent.addMove(MOVE_RED_STRIKE);
manager.process_turn(player,opponent);
//
var wMargin = ((CANVAS.width + CANVAS.height)/2) * 0.01;
var gui_pannel1 = new GUI_Window
(
    wMargin,
    wMargin,
    CANVAS.width * 0.3,
    CANVAS.height - (wMargin*2)
);
var gui_pannel2 = new GUI_Window
(
    CANVAS.width * 0.3 + (wMargin*2),
    wMargin,
    CANVAS.width * 0.7 - (wMargin*3),
    CANVAS.height * 0.25 - wMargin
);
var gui_pannel3 = new GUI_Window
(
    CANVAS.width * 0.3 + (wMargin*2),
    CANVAS.height * 0.25 + wMargin,
    CANVAS.width * 0.7 - (wMargin*3),
    CANVAS.height * 0.5 - wMargin
);
var gui_pannel4 = new GUI_Window
(
    CANVAS.width * 0.3 + (wMargin*2),
    CANVAS.height * 0.75 + wMargin,
    CANVAS.width * 0.7 - (wMargin*3),
    CANVAS.height * 0.25 - (wMargin*2)
);

//////////////////////////////////////////////////////////////////////
///////////////////////  / TESTING TOOLS /  / ////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Print to the log all the essentials informations of current state of the fighting game.
 */
function printGameState()
{
    console.log("HP --- " + player.health + " VS " + opponent.health);
    console.log("ATK -- " + player.attack + " VS " + opponent.attack);
    console.log("DEF -- " + player.defense + " VS " + opponent.defense);
    console.log("SPD -- " + player.speed + " VS " + opponent.speed);
    console.log(
        "MOVE - " +
        player.moveArray[player.moveArray.length - 1]
        + " VS " +
        opponent.moveArray[player.moveArray.length - 1]  
    );
}

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
    CTX.fillStyle = "black";
    CTX.fillRect(0,0, CANVAS.width, CANVAS.height);
    // GUI
    gui_pannel1.draw();
    gui_pannel2.draw();
    gui_pannel3.draw();
    gui_pannel4.draw();
    //// ELEMENT
    //// MOVELIST
    CTX.font = "30px Arial";
    CTX.fillStyle = "black";
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