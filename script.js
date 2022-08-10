window.addEventListener("load", function(){
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");

    class InputHandler {
        constructor(){
            this.keys = [];
            window.addEventListener('keydown', function(e){
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

    function animate(){

    }

});