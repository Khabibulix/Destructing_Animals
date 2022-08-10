window.addEventListener("load", function(){
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    const enemies = []
    let score = 0;
    let gameOver = false;

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
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + (this.height+50)/2, this.width/2, 0, Math.PI * 2);
            context.stroke();
            //context.fillStyle = 'white';
            //context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image, this.x, this.y, this.width, this.height + 50);
        }
        update(input, enemies){
            //collision detection using Pythagoras
            enemies.forEach(enemy => {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < enemy.width/2 + this.width/2){
                    gameOver = true;
                }
            });
            //controls
            if(input.keys.indexOf("ArrowRight") > -1){
                this.speed += 1;
            } else if(input.keys.indexOf("ArrowLeft") > -1){
                this.speed -= 1;
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

    class Enemy {
        constructor(game_width, game_height){
            this.game_width = game_width;
            this.game_height = game_height;
            this.width = 200;
            this.height = 160;            
            this.x = this.game_width;
            this.y = this.game_height - this.height;
            this.maxFrame = 5;
            this.image = document.getElementById("enemyImage");
            this.speed = 8;
            this.marked_for_deletion = false;
        }
        draw(context){        
            context.beginPath();
            context.arc(this.x + this.width/2, this.y + (this.height+50)/2, this.width/2, 0, Math.PI * 2);
            context.stroke();
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        update(deltaTime){
            this.x-= this.speed;
            if (this.x < 0 - this.width){
                this.marked_for_deletion = true;
            } 
            
        }
    }

        
    function handleEnemies(deltaTime){
        if (enemyTimer > enemyInterval + randomEnemyInterval){
            enemies.push(new Enemy(canvas.width, canvas.height))
            randomEnemyInterval = Math.random() * 1000 + 500;
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx);
            enemy.update(deltaTime);
        });
        enemies.filter(enemy => !enemy.marked_for_deletion);
    }

    function displayText(context){        
        context.font = '40px Helvetica';
        context.fillStyle = "black";
        context.fillText("Score: " + score, 20, 50);
        //Double for text-shadow        
        context.fillStyle = "white";
        context.fillText("Score: " + score, 22, 52);
    }

    const input = new InputHandler();
    const player =  new Player(canvas.width, canvas.height);
    const background = new Background(canvas.width, canvas.height);

    let last_time = 0;
    let enemyTimer = 0;
    let enemyInterval = 2000;
    let randomEnemyInterval = Math.random() * 1000 + 500;

    function animate(timeStamp){
        const deltaTime = timeStamp - last_time;
        last_time = timeStamp;
        ctx.clearRect(0,0, canvas.width, canvas.height)        
        background.draw(ctx);
        background.update();
        player.draw(ctx)
        player.update(input, enemies);
        handleEnemies(deltaTime);
        displayText(ctx);
        if (!gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});