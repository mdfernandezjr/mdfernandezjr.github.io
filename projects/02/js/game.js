class Game{constructor(){this.canvas=document.getElementById("gameCanvas");this.ctx=this.canvas.getContext("2d");this.score=0;this.gameOver=false;this.player={x:this.canvas.width/2,y:this.canvas.height-50,width:30,height:40,speed:5,bullets:[]};this.keys={};this.obstacles=[];this.lastObstacleTime=0;this.obstacleInterval=1000;this.backgroundStars=this.createStars();this.setupEventListeners();this.gameLoop()}createStars(){const stars=[];for(let i=0;i<100;i++){stars.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,size:Math.random()*2+1,speed:Math.random()*2+1})}return stars}setupEventListeners(){document.addEventListener("keydown",(e)=>this.keys[e.key]=true);document.addEventListener("keyup",(e)=>this.keys[e.key]=false);document.addEventListener("keydown",(e)=>{if(e.key===" "&&!this.gameOver){this.shoot()}})}shoot(){this.player.bullets.push({x:this.player.x+this.player.width/2,y:this.player.y,width:4,height:10,speed:7})}update(){if(this.gameOver)return;if(this.keys["ArrowLeft"])this.player.x=Math.max(0,this.player.x-this.player.speed);if(this.keys["ArrowRight"])this.player.x=Math.min(this.canvas.width-this.player.width,this.player.x+this.player.speed);if(this.keys["ArrowUp"])this.player.y=Math.max(0,this.player.y-this.player.speed);if(this.keys["ArrowDown"])this.player.y=Math.min(this.canvas.height-this.player.height,this.player.y+this.player.speed);this.player.bullets=this.player.bullets.filter(bullet=>{bullet.y-=bullet.speed;return bullet.y>0});this.backgroundStars.forEach(star=>{star.y+=star.speed;if(star.y>this.canvas.height){star.y=0;star.x=Math.random()*this.canvas.width}});const currentTime=Date.now();if(currentTime-this.lastObstacleTime>this.obstacleInterval){this.obstacles.push({x:Math.random()*(this.canvas.width-30),y:-30,width:30,height:30,speed:Math.random()*2+2,type:Math.random()<0.2?"planet":"asteroid"});this.lastObstacleTime=currentTime}let obstaclesDestroyed=[];let bulletsToRemove=[];this.obstacles.forEach((obstacle,obstacleIndex)=>{obstacle.y+=obstacle.speed;this.player.bullets.forEach((bullet,bulletIndex)=>{if(this.checkCollision(bullet,obstacle)){obstaclesDestroyed.push(obstacleIndex);bulletsToRemove.push(bulletIndex);this.score+=10;document.getElementById("score").textContent=`Score: ${this.score}`}});if(this.checkCollision(this.player,obstacle)){this.gameOver=true;document.getElementById("gameOver").style.display="block";document.getElementById("finalScore").textContent=this.score}});bulletsToRemove.reverse().forEach(index=>{this.player.bullets.splice(index,1)});obstaclesDestroyed.reverse().forEach(index=>{this.obstacles.splice(index,1)});this.obstacles=this.obstacles.filter(obstacle=>obstacle.y<this.canvas.height)}checkCollision(rect1,rect2){return rect1.x<rect2.x+rect2.width&&rect1.x+rect1.width>rect2.x&&rect1.y<rect2.y+rect2.height&&rect1.y+rect1.height>rect2.y}draw(){this.ctx.fillStyle="#000033";this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);this.ctx.fillStyle="#FFF";this.backgroundStars.forEach(star=>{this.ctx.beginPath();this.ctx.arc(star.x,star.y,star.size,0,Math.PI*2);this.ctx.fill()});this.ctx.fillStyle="#00FF00";this.ctx.fillRect(this.player.x,this.player.y,this.player.width,this.player.height);this.ctx.fillStyle="#FF0";this.player.bullets.forEach(bullet=>{this.ctx.fillRect(bullet.x,bullet.y,bullet.width,bullet.height)});this.obstacles.forEach(obstacle=>{this.ctx.fillStyle=obstacle.type==="planet"?"#4CAF50":"#FF4444";this.ctx.beginPath();this.ctx.arc(obstacle.x+obstacle.width/2,obstacle.y+obstacle.height/2,obstacle.width/2,0,Math.PI*2);this.ctx.fill()})}gameLoop(){this.update();this.draw();requestAnimationFrame(()=>this.gameLoop())}}function restartGame(){document.getElementById("gameOver").style.display="none";document.getElementById("score").textContent="Score: 0";window.game=new Game()}window.onload=()=>{window.game=new Game()};
