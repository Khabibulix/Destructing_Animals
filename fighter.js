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
const MOVECOST_RED_STRIKE_R     =  [10, 0 , 0 ]; // Classic
const MOVECOST_RED_STRIKE_B     =  [0 , 40, 0 ];
const MOVECOST_RED_STRIKE_G     =  [0 , 0 , 20];
/**/
const MOVECOST_BLUE_SHIELD_R    =   [20, 0 , 0 ];
const MOVECOST_BLUE_SHIELD_B    =   [0 , 10, 0 ]; // Classic
const MOVECOST_BLUE_SHIELD_G    =   [0 , 0 , 40];
/**/
const MOVECOST_GREEN_WARMUP_R   =   [40, 0 , 0 ];
const MOVECOST_GREEN_WARMUP_B   =   [0 , 20, 0 ];
const MOVECOST_GREEN_WARMUP_G   =   [0 , 0 , 10]; // Classic
    /* Hybrid */
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
// GUI MOVELIST
const MOVELIST = ["Red Strike","Blue Shield","Green Warm-up","Magenta Shock","Yellow Lightning","Cyan Dodge"];
const MOVELIST_COLOR = ["red","blue","green","magenta","yellow","cyan"];
const MOVEBUTTON_COST =
[
    [
        "10 R",
        "40 B",
        "20 G"
    ],
    [
        "20 R",
        "10 B",
        "40 G"       
    ],
    [
        "40 R",
        "20 B",
        "10 G"     
    ],
    [
        "10 R 10 B",
        "10 B 20 G",
        "30 R",
        "20 R 20 G"
    ],
    [
        "10 R 10 G",
        "10 R 20 B",
        "30 G",
        "20 B 20 G"
    ],
    [
        "10 B 10 G",
        "20 R 10 G",
        "30 B",
        "20 R 20 B"
    ]
];
const MOVEFUNC =
[
    [
        f => {market.buy(player, MOVE_RED_STRIKE, MOVECOST_RED_STRIKE_R)},
        f => {market.buy(player, MOVE_RED_STRIKE, MOVECOST_RED_STRIKE_B)},
        f => {market.buy(player, MOVE_RED_STRIKE, MOVECOST_RED_STRIKE_G)}
    ],
    [
        f => {market.buy(player, MOVE_BLUE_SHIELD, MOVECOST_BLUE_SHIELD_R)},
        f => {market.buy(player, MOVE_BLUE_SHIELD, MOVECOST_BLUE_SHIELD_B)},
        f => {market.buy(player, MOVE_BLUE_SHIELD, MOVECOST_BLUE_SHIELD_G)}

    ],
    [
        f => {market.buy(player, MOVE_GREEN_WARMUP, MOVECOST_GREEN_WARMUP_R)},
        f => {market.buy(player, MOVE_GREEN_WARMUP, MOVECOST_GREEN_WARMUP_B)},
        f => {market.buy(player, MOVE_GREEN_WARMUP, MOVECOST_GREEN_WARMUP_G)}
    ],
    [
        f => {market.buy(player, MOVE_MAGENTA_SHOCK, MOVECOST_MAGENTA_SHOCK0)},
        f => {market.buy(player, MOVE_MAGENTA_SHOCK, MOVECOST_MAGENTA_SHOCK1)},
        f => {market.buy(player, MOVE_MAGENTA_SHOCK, MOVECOST_MAGENTA_SHOCK2)},
        f => {market.buy(player, MOVE_MAGENTA_SHOCK, MOVECOST_MAGENTA_SHOCK3)}
    ],
    [
        f => {market.buy(player, MOVE_YELLOW_LIGHTNING, MOVECOST_YELLOW_LIGHTNING0)},
        f => {market.buy(player, MOVE_YELLOW_LIGHTNING, MOVECOST_YELLOW_LIGHTNING1)},
        f => {market.buy(player, MOVE_YELLOW_LIGHTNING, MOVECOST_YELLOW_LIGHTNING2)},
        f => {market.buy(player, MOVE_YELLOW_LIGHTNING, MOVECOST_YELLOW_LIGHTNING3)}
    ],
    [
        f => {market.buy(player, MOVE_CYAN_DODGE, MOVECOST_CYAN_DODGE0)},
        f => {market.buy(player, MOVE_CYAN_DODGE, MOVECOST_CYAN_DODGE1)},
        f => {market.buy(player, MOVE_CYAN_DODGE, MOVECOST_CYAN_DODGE2)},
        f => {market.buy(player, MOVE_CYAN_DODGE, MOVECOST_CYAN_DODGE3)}
    ]
];

//////////////////////////////////////////////////////////////////////
//////////////////////////  / GLOBALS /  / ///////////////////////////
//////////////////////////////////////////////////////////////////////

var buttonList = [];

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
        this.mouseClick = 0;
        document.addEventListener("mousedown", this.listener.bind(this), false);
        document.addEventListener("mouseup", this.listener.bind(this), false);
        document.addEventListener("mousemove", this.listener.bind(this), false);

    }
    listener(event)
    {
        this.mouseClick = event.buttons;
        if (event.target == CANVAS)
        {
            this.x = event.layerX;
            this.y = event.layerY;
        }
        else
        {
            this.x = -1;
            this.y = -1;
        }
    }
    isOnScreen()
    {
        return !(this.x == -1 || this.y == -1);
    }
}
var mouse = new Mouse();

//////////////////////////////////////////////////////////////////////
///////////////////////  /  GAME CLASSES /  / ////////////////////////
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
     * Checks if the chosen move can be bought by a player.
     * @param {Number[]} money Array of 3 Number representing the currency available.
     * @param {Number[]} movecost Array of 3 Number representing the cost of the move.
     * @returns True if the player can buy it, False otherwise.
     */
    checkMoveCost(money, movecost)
    {
        if
        (
            money[0] >= movecost[0]
            &&
            money[1] >= movecost[1]
            &&
            money[2] >= movecost[2]
        ) return true;
        return false;
    }
    /**
     * Checks if the chosen move can be bought by a player.
     * @param {Number[]} money Array of 3 Number representing the currency available.
     * @param {Number[]} movecost Array of 3 Number representing the cost of the move.
     * @returns True if the player can buy it, False otherwise. 
     */
    canIBuyThat(money, move)
    {
        switch (move) {
            case MOVE_GUARD: return true;
            case MOVE_RED_STRIKE:
            if
            (
                this.checkMoveCost(money, MOVECOST_RED_STRIKE_R)
                ||
                this.checkMoveCost(money, MOVECOST_RED_STRIKE_B)
                ||
                this.checkMoveCost(money, MOVECOST_RED_STRIKE_G)
            ) return true; break;
            case MOVE_BLUE_SHIELD:
            if
            (
                this.checkMoveCost(money, MOVECOST_BLUE_SHIELD_R)
                ||
                this.checkMoveCost(money, MOVECOST_BLUE_SHIELD_B)
                ||
                this.checkMoveCost(money, MOVECOST_BLUE_SHIELD_G)
            ) return true; break;
            case MOVE_GREEN_WARMUP:
            if
            (
                this.checkMoveCost(money, MOVECOST_GREEN_WARMUP_R)
                ||
                this.checkMoveCost(money, MOVECOST_GREEN_WARMUP_B)
                ||
                this.checkMoveCost(money, MOVECOST_GREEN_WARMUP_G)
            ) return true; break;
            case MOVE_MAGENTA_SHOCK:
            if
            (
                this.checkMoveCost(money, MOVECOST_MAGENTA_SHOCK0)
                ||
                this.checkMoveCost(money, MOVECOST_MAGENTA_SHOCK1)
                ||
                this.checkMoveCost(money, MOVECOST_MAGENTA_SHOCK2)
                ||
                this.checkMoveCost(money, MOVECOST_MAGENTA_SHOCK3)
            ) return true; break;
            case MOVE_YELLOW_LIGHTNING:
            if
            (
                this.checkMoveCost(money, MOVECOST_YELLOW_LIGHTNING0)
                ||
                this.checkMoveCost(money, MOVECOST_YELLOW_LIGHTNING1)
                ||
                this.checkMoveCost(money, MOVECOST_YELLOW_LIGHTNING2)
                ||
                this.checkMoveCost(money, MOVECOST_YELLOW_LIGHTNING3)
            ) return true; break;
            case MOVE_CYAN_DODGE:
            if
            (
                this.checkMoveCost(money, MOVECOST_CYAN_DODGE0)
                ||
                this.checkMoveCost(money, MOVECOST_CYAN_DODGE1)
                ||
                this.checkMoveCost(money, MOVECOST_CYAN_DODGE2)
                ||
                this.checkMoveCost(money, MOVECOST_CYAN_DODGE3)
            ) return true; break;
            default: break;
        }
        return false;
    }
    /**
     * Allows a player to buy a move if it has the ressources.
     * @param {Fighter_Player} player Player.
     * @param {Number} move Move ID.
     * @param {Number[]} price Array of 3 Number representing the price of the move.
     * @returns Nothing.
     */
    buy(player, move, price)
    {
        if(this.checkMoveCost(player.money, price)){
            for (let i = 0; i < 3 ; i++) player.money[i] -= price[i];
            player.addSpending(price);
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
        this.spendingArray = [] // Array reprensenting the money spended for each move (used for attribute consumption).
        this.dodge = 0; // Used by Cyan Dodge move.
    }
    /**
     * Adds a spending to the associated array.
     * @param {Number[]} price Array of 3 Number representing the price of the bought move.
     */
    addSpending(price)
    {
        this.spendingArray.push(price);
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

//////////////////////////////////////////////////////////////////////
///////////  / GRAPHICAL USER INTERFACE CLASSES /  / /////////////////
//////////////////////////////////////////////////////////////////////

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

class GUI_Button
{
    constructor(x, y, width, height, text, func)
    {
        this.x = x;
        this.y = y
        this.width = width;
        this.height = height;
        this.text = text;
        this.isTouched = false;
        this.isOnClick = false;
        this.wasOnClick = false;
        this.func = func;
    }
    draw()
    {
        if (this.isOnClick)         CTX.fillStyle = "#eeeeee";
        else if (this.isTouched)    CTX.fillStyle = "#aaaaaa";
        else                        CTX.fillStyle = "#666666";
        CTX.fillRect
        (
            this.x,
            this.y,
            this.width,
            this.height
        );
        CTX.font = "16px Arial";
        CTX.fillStyle = "black";
        CTX.fillText(this.text, this.x, this.y + (this.height * 0.5));
    }
    checkCollision(mouse)
    {
        if
        (
                mouse.x > this.x
            &&  mouse.x < this.x + this.width
            &&  mouse.y > this.y
            &&  mouse.y < this.y + this.height
        ) return true;
        return false;
    }
    triggerFunc()
    {
        this.func();
    }
    process(mouse)
    {
        this.isTouched = false;
        this.isOnClick = false;
        if (this.checkCollision(mouse))
        {
            this.isTouched = true;
            if (mouse.mouseClick == 1)
            {
                if (!this.wasOnClick) this.isOnClick = true;
                this.wasOnClick = true;
            }
            else  this.wasOnClick =  false;
        }
        if (this.isOnClick) this.triggerFunc();
    }
}

//////////////////////////////////////////////////////////////////////
///////////////////////  / OBJECTS INIT /  / /////////////////////////
//////////////////////////////////////////////////////////////////////

var market = new Fighter_Market();
var player = new Fighter_Player(100, 50, 50, 50);
var opponent = new Fighter_Player(100, 75, 75, 75);
var manager = new Fighter_Manager;
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

// MOVE BUTTONS
for (let y = 0 ; y <= 5 ; y++)
{
    for (let x = 0 ; y <= 2? x <= 2 : x <=3 ; x++)
    {
        buttonList.push(
            new GUI_Button(
                y <= 2? CANVAS.width*0.2 + (50*x) : CANVAS.width*0.2 + (100*x),
                CANVAS.height*0.1 + (50*y),
                y <= 2? 50 : 100,
                50,
                MOVEBUTTON_COST[y][x],
                MOVEFUNC[y][x]
            )
        )
    }
}
// Start fight
var buttonFight = new GUI_Button(
    CANVAS.width*0.05,
    CANVAS.height*0.7,
    100,
    100,
    "DONE",
    f => {manager.process_turn(player, opponent)}
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
    buttonList.forEach(element => {
        element.process(mouse);
    });
    buttonFight.process(mouse);

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
    CTX.fillText("GEMS = " + player.money, CANVAS.width*0.025, CANVAS.height*0.9);
    CTX.fillText("BOUGHT = " + player.moveArray, CANVAS.width*0.025, CANVAS.height*0.95);
    CTX.fillText("OPPONENT MOVELIST", CANVAS.width*0.55, CANVAS.height*0.1);
    CTX.fillText(opponent.moveArray, CANVAS.width*0.55, CANVAS.height*0.15);
    CTX.fillText("YOUR MOVELIST", CANVAS.width*0.55, CANVAS.height*0.85);
    CTX.fillText(player.moveArray, CANVAS.width*0.55, CANVAS.height*0.9);
    for (let i = 0 ; i < 6 ; i++)
    {
        CTX.fillStyle = MOVELIST_COLOR[i];
        CTX.fillText(MOVELIST[i], CANVAS.width*0.05, 100 + (50*i));
    }
    //// PLAYERS
    // P1
    CTX.fillStyle = "black";
    CTX.fillRect(CANVAS.width*0.5,CANVAS.height*0.5,100,100);
    CTX.fillRect(CANVAS.width*0.48,CANVAS.height*0.35,150,10);
    CTX.fillText(player.health, CANVAS.width*0.48 + 150, CANVAS.height*0.35);
    CTX.fillStyle = "red";
    CTX.fillRect(CANVAS.width*0.48,CANVAS.height*0.38,150,10);
    CTX.fillText(player.attack, CANVAS.width*0.48 + 150, CANVAS.height*0.38);
    CTX.fillStyle = "blue";
    CTX.fillRect(CANVAS.width*0.48,CANVAS.height*0.41,150,10);
    CTX.fillText(player.defense, CANVAS.width*0.48 + 150, CANVAS.height*0.41);
    CTX.fillStyle = "green";
    CTX.fillRect(CANVAS.width*0.48,CANVAS.height*0.44,150,10);
    CTX.fillText(player.speed, CANVAS.width*0.48 + 150, CANVAS.height*0.44);
    // P2
    CTX.fillStyle = "black";
    CTX.fillRect(CANVAS.width*0.7,CANVAS.height*0.5,100,100);
    CTX.fillRect(CANVAS.width*0.68,CANVAS.height*0.35,150,10);
    CTX.fillText(opponent.health, CANVAS.width*0.68 + 150, CANVAS.height*0.35);
    CTX.fillStyle = "red";
    CTX.fillRect(CANVAS.width*0.68,CANVAS.height*0.38,150,10);
    CTX.fillText(opponent.attack, CANVAS.width*0.68 + 150, CANVAS.height*0.38);
    CTX.fillStyle = "blue";
    CTX.fillRect(CANVAS.width*0.68,CANVAS.height*0.41,150,10);
    CTX.fillText(opponent.defense, CANVAS.width*0.68 + 150, CANVAS.height*0.41);
    CTX.fillStyle = "green";
    CTX.fillRect(CANVAS.width*0.68,CANVAS.height*0.44,150,10);
    CTX.fillText(opponent.speed, CANVAS.width*0.68 + 150, CANVAS.height*0.44);
    // BUTTON
    buttonList.forEach(element => {
        element.draw();
    });
    buttonFight.draw();
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