const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const bricks = []
let score = 0;
let gameOver = false;


//Classes

/**
 * This class is handling all the keys pressed in the web browser via two events listeners.
 * @param {list} keys
 * @event If a key is down, we stock it in keys only if key doesn't exist in keys
 * @event If the same key is up, we remove it from keys
 * @author Khabibulix
 */
class InputHandler {
    constructor(){
        this.keys = [];
        window.addEventListener('keydown', e =>{
            if ((e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight')
                && (this.keys.indexOf(e.key) === -1)){
                this.keys.push(e.key);
            }
        });        
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowDown' || 
                e.key === 'ArrowUp' || 
                e.key === 'ArrowLeft' || 
                e.key === 'ArrowRight'){
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }                
        });
    }
}

/**
 * This class is creating bricks objects.
 * @author Khabibulix
 * @param {Int} width represents the current width of the brick object
 * @param {Int} height represents the current height of the brick object
 * @param {Int} game_width represents the game width of the canvas to make collision detection easier. DEFAULT --> 1500, see index.html
 * @param {Int} game_height represents the game height of the canvas to make collision detection easier. DEFAULT --> 700, see index.html
 * @param {Int} x represents the current position of the brick object. DEFAULT --> Is equal to default game_width, because we want it outside of the screen to make the scrolling effective
 * @param {Int} y represents the current position of the brick object DEFAULT --> At 4 bricks of the ground, the ground is 'this.game_height - this.height'
 * @param {File} image represents the current sprite of the brick object
 * @param {Int} speed represents the speed of the brick object
 * @param {Boolean} marked_for_deletion is used to check is the brick is outside the playground, if the answer is yes, we mark it for deletion in update(). DEFAULT --> false 
 *  
 */
class Brick {
    constructor(game_width, game_height, y){
        this.game_width = game_width;
        this.game_height = game_height;
        this.width = 100;
        this.height = 100;
        this.x = this.game_width;
        this.y = y
        this.image = document.getElementById("brickImage");   
        this.speed = 6;          
        this.marked_for_deletion = false;
    }
    /**
     * Display the brick using coordinates and drawing a hitbox around the brick object
     * @param {CanvasObject} context which canvas do you want to draw the brick?
     * @returns void
     */
    draw(context){            
        context.beginPath();         
        context.strokeRect(this.x, this.y, this.width, this.height);            
        context.strokeStyle = "blue";
        context.stroke();
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    /**
     * We want to loop to change the position of the brick, we check if the brick is outside and we make it move from right to left using his speed
     */
    update(){
        this.x -= this.speed;
        return (this.x < 0 - this.width ? this.marked_for_deletion = true : false);
    }
}

/**
 * This class is creating the player object once.
 * @author Khabibulix
 * @param {Int} width represents the current width of the player object. DEFAULT --> 200
 * @param {Int} height represents the current height of the player object. DEFAULT --> 252
 * @param {Int} game_width represents the game width of the canvas to make collision detection easier. DEFAULT --> 1500, see index.html
 * @param {Int} game_height represents the game height of the canvas to make collision detection easier. DEFAULT --> 700, see index.html
 * @param {Int} x represents the current position of the player object. DEFAULT --> 500, because we want it far from right side where bricks are coming
 * @param {Int} y represents the current position of the player object DEFAULT --> On ground using his height in 'this.game_height - this.height'
 * @param {File} image represents the current sprite of the player object
 * @param {Int} speed represents the speed of the player object. DEFAULT --> 0 because it shall not move without inputs
 * @param {Int} vy is used to jump, it represents his velocity on vertical axis, it shall not jump if the 'Up Arrow Key' isn't pressed. DEFAULT --> 0
 * @param {Int} weight is used to fall, we oppose it to the velocity to make the player come back on ground and simulate the gravity. DEFAULT --> 1
 * @param {Boolean} canJump determines if the player is able to jump, it is useful because we don't allow double jumps, if the player is in mid-air for example.
 *  
 */
class Player {
    constructor(game_width, game_height){
        this.game_width = game_width;
        this.game_height = game_height;
        this.width = 200;
        this.height = 252;
        this.x = 500;
        this.y = this.game_height - this.height;
        this.image = document.getElementById("playerImage");
        this.speed = 0;
        this.vy = 0;
        this.weight = 1;
        this.canJump = true;
        
    }

    /**
     * Display the player using coordinates and drawing a hitbox around the player object
     * @param {CanvasObject} context which canvas do you want to draw the player on?
     * @returns void
     */
    draw(context){
        context.beginPath();
        context.strokeRect(this.x, this.y, this.width, this.height);
        context.stroke();
        context.drawImage(this.image, this.x, this.y, this.width, this.height + 50);
    }

    /**
     * Update the player position, core of the collision detection too, /!\do not change values here only if absolutely necessary/!\
     * @param {InputHandler} input Represents an object created using InputHandler class, we want the Player class to know which keys are pressed 
     * @param {List} bricks Represents all the bricks created using the function handleBricks(), we want the Player class to know where the bricks are, for the collision detection
     */
    update(input, bricks){
        this.weight =  1;
        this.canJump = false; // You won't jump mid-air !
        
        //check floor collision
        if (!this.onGround()){
            this.vy += this.weight;
        } else {
            this.vy = 0;
            this.canJump = true;
        }
        
        for (let brick of bricks) {            
            if (this.x < brick.x + brick.width && this.x + this.width  > brick.x ) {    
                
                //teleportation if player is close to left border and crushing by brick
                if (this.x < 10){
                    this.x = 500;
                    this.y = 200;
                    this.vy = 0;
                }

                //left side of brick
                if (this.x  < brick.x ){ 
                    if (this.y < brick.y + brick.height && this.height + this.y > brick.y){
                        this.x = brick.x - brick.width - 90;
                        this.speed = 0;
                        break;
                    }
                }

                // right side of brick
                if (this.x  > brick.x){
                    if (this.y < brick.y - brick.height && this.height + this.y > brick.y){
                        this.x = brick.x + brick.width + 10;
                        this.speed = 0;
                    }
                }

                //up side of brick
                if (this.y + this.height < brick.y){
                    if (this.vy >= 0) // Only affects the player if is falling or landed.
                    {
                        this.vy -= ((this.y + this.height) - brick.y) // Brick/Player remaining distance.
                        this.vy /= 8; // Make sure the player won't fall too quickly and so bypass collision check.
                        this.vy = Math.floor(this.vy); // Rounding the value to avoid anti-aliasing (optimization).
                        if (this.vy == 0) this.canJump = true; // Make sure the player is fully landed before being able to jump.
                    }
                /* 
                Multiple checks here:
                    1)  this.y + this.height * 2 > brick.y          -->  the player is exactly below the current brick tested
                    2)  this.vy < 0                                 -->  the player is jumping
                    3)  (this.y + this.height) - brick.y < 375)     -->  the player hitbox distance from the brick hitbox is getting close
                */  
               //bottom side of brick     
                } else if (this.y + this.height * 2 > brick.y && this.vy < 0) {                     
                    if ((this.y + this.height) - brick.y < 375){                                  
                        this.vy = 0;
                    }
                }
            }
            
        };
        
        //controls
        if(input.keys.indexOf("ArrowRight") > -1){
            this.speed += 1;
        } else if(input.keys.indexOf("ArrowLeft") > -1){
            this.speed -= 1;
        } else if(input.keys.indexOf("ArrowUp") > -1 && this.canJump){
            if(input.keys.indexOf("ArrowRight") > -1){
                this.speed += 1
            }
            if(input.keys.indexOf("ArrowLeft") > -1){
                this.speed -= 1
            }
            this.vy-= 30;
            this.canJump = false;
        } else {
            this.speed = 0;
        }            
        //apply mov vector            
        this.x += this.speed;
        this.y += this.vy;
        //canvas border capping
        if (this.x < 0) this.x = 0;
        else if (this.x > this.game_width - this.width) this.x = this.game_width - this.width;
        if (this.y  > this.game_height - this.height) this.y = this.game_height - this.height;

    }
    /**
     * Check if the player is currently on ground and if it can jump
     * @returns {Boolean} 
     */
    onGround(){
        return this.y >= this.game_height - this.height;
    }
}

/**
 * Handles the background, his scrolling, the picture displayed
 * @author Khabibulix
 * @param {Int} game_width represents the game width of the canvas to make collision detection easier. DEFAULT --> 1500, see index.html
 * @param {Int} game_height represents the game height of the canvas to make collision detection easier. DEFAULT --> 700, see index.html
 * @param {File} image represents the current sprite of the background object
 * @param {Int} x represents the current position of the background object. DEFAULT --> 0, because we want it to cover all canvas
 * @param {Int} y represents the current position of the background object. DEFAULT --> 0, because we want it to cover all canvas
 * @param {Int} width represents the current width of the background object. DEFAULT --> 1600
 * @param {Int} height represents the current height of the background object. DEFAULT --> 848
 * @param {Int} speed represents the speed of the background object. DEFAULT --> 20 for a smooth scrolling
 * */
class Background {
    constructor(game_width, game_height){
        this.game_width = game_width;
        this.game_height = game_height;
        this.image = document.getElementById("backgroundImage");
        this.x = 0;
        this.y = 0;
        this.width = 1600;
        this.height = 848;
        this.speed = 20;
    }
    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height); //Second canvas trick to make scrolling
    }
    update(){
        this.x -= this.speed;
        if (this.x < 0 - this.width) this.x = 0;
    }
}

//Functions

/**
 * Function where all the code for bricks go, we draw, we update and we delete bricks from here 
 * @author Khabibulix
 * @param {Number} deltaTime Is used for constantly generating bricks on a certain time
 * @tutorial Math.Random intervals : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */
function handleBricks(deltaTime){  
    if (Timer > Interval + randomInterval){
        bricks.push(new Brick(canvas.width, canvas.height, Math.random() * (900 - 600) + 600))
        bricks.push(new Brick(canvas.width, canvas.height, Math.random() * 1000))  //randomizing y pos 

        randomInterval = Math.random() * 1000 + 200;
        Timer = 0;     
           
        
    } else {
        Timer += deltaTime;
    }
    bricks.forEach(brick => {
        brick.draw(ctx);
        brick.update(deltaTime);
    });
    bricks.forEach(brick => {
        if (brick.marked_for_deletion){
            bricks.shift();
        }
    });
    bricks.filter(brick => !brick.marked_for_deletion);
}
/**
 * Used to display score, for game over, or when score is incrementing
 * @author Khabibulix
 * @param {CanvasContext} context Precise where the text will be, in which canvas
 */
function displayText(context){        
    context.font = '40px Helvetica';
    context.fillStyle = "black";
    context.fillText("Score: " + score, 20, 50);
    //Double for text-shadow        
    context.fillStyle = "blue";
    context.fillText("Score: " + score, 22, 52);
    if (gameOver){
        context.textAlign = "center";
        context.fillStyle = "black";
        context.fillText("Game Over: You lose! ", canvas.width/2, 200);            
        context.fillStyle = "blue";
        context.fillText("Game Over: You lose! ", canvas.width/2 + 2, 202);
    }
}

const input = new InputHandler();
const player =  new Player(canvas.width, canvas.height);
const background = new Background(canvas.width, canvas.height);

let last_time = 0;
let Timer = 0;
let Interval = 2000;
let randomInterval = Math.random() * 1000 + 500;

function animate(timeStamp){
    const deltaTime = timeStamp - last_time;
    last_time = timeStamp;
    ctx.clearRect(0,0, canvas.width, canvas.height)      
    //background.draw(ctx);
    //background.update();
    player.draw(ctx)
    player.update(input, bricks);              
    handleBricks(deltaTime);
    displayText(ctx);
    if (!gameOver) requestAnimationFrame(animate);
}
animate(0);