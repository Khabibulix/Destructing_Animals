window.addEventListener("load", function(){
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    class InputHandler {
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', e =>{
                if ((e.key === 'ArrowDown' || 
                    e.key === 'ArrowUp' || 
                    e.key === 'ArrowLeft' || 
                    e.key === 'ArrowRight')
                    && (this.keys.indexOf(e.key) === -1)){ //if key already in keys
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

    class Player {
        constructor(game_width, game_height){
            this.game_width = game_width;
            this.game_height = game_height;
            this.width = 200;
            this.height = 252;
            this.x = 0;
            this.y = this.game_height - this.height;
            this.image = document.getElementById("playerImage");
            this.speed = 0;
            this.vy = 0;
            this.weight = 1;

        }
        draw(context){
            context.fillStyle = 'white';
            context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        update(input){
            if(input.keys.indexOf("ArrowRight") > -1){
                this.speed = 5;
            } else if(input.keys.indexOf("ArrowLeft") > -1){
                this.speed -= 5;
            } else if(input.keys.indexOf("ArrowUp") > -1 && this.onGround()){
                this.vy-= 30;
            } else {
                this.speed = 0;
            }            
            //horizontal mov            
            this.x += this.speed;
            if (this.x < 0) this.x = 0;
            else if (this.x > this.game_width - this.width) this.x = this.game_width - this.width
            //vertical mov
            this.y += this.vy;
            if (!this.onGround()){
                this.vy += this.weight;
            } else {
                this.vy = 0;
            }
            if (this.y  > this.game_height - this.height) this.y = this.game_height - this.height

        }
        onGround(){
            return this.y >= this.game_height - this.height;
        }
    }

    class Background {
        constructor(game_width, game_height){
            this.game_width = game_width;
            this.game_height = game_height;
            this.image = document.getElementById("backgroundImage");
            this.x = 0;
            this.y = 0;
            this.width = 1600;
            this.height = 848;
        }
        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    class Enemy {

    }

    function handleEnemies(){

    }

    function displayText(){

    }

    const input = new InputHandler();
    const player =  new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    function animate(){
        ctx.clearRect(0,0, canvas.width, canvas.height)        
        background.draw(ctx);
        player.draw(ctx)
        player.update(input);
        requestAnimationFrame(animate);
    }
    animate();
});