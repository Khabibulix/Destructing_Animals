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
            this.height = 200;
            this.x = 0;
            this.y = 0;
        }
        draw(context){
            context.fillStyle = 'white';
            context.fillRect(this.x, this.y, this.width, this.height);
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
    player.draw(ctx)

    function animate(){

    }

});