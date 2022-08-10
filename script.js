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

        }
        draw(context){
            context.fillStyle = 'white';
            context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        update(input){
            //horizontal mov
            this.x += this.speed;
            if(input.keys.indexOf("ArrowRight") > -1){
                this.speed = 5;
            } else {
                this.speed = 0;
            }
        }
    }

    class Background {

    }

    class Enemy {

    }

    function handleEnemies(){

    }

    function displayText(){

    }

    const input = new InputHandler();
    const player =  new Player(canvas.width, canvas.height);

    function animate(){
        ctx.clearRect(0,0, canvas.width, canvas.height)
        player.draw(ctx)
        player.update(input);
        requestAnimationFrame(animate);
    }
    animate();
});