document.addEventListener("DOMContentLoaded",function(){window.addEventListener("keydown",function(e){if(e.key===" "||e.key==="ArrowUp"||e.key==="ArrowDown"||e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();return false}},false)});class Game{constructor(){this.canvas=document.getElementById("gameCanvas");this.ctx=this.canvas.getContext("2d");this.score=0;this.gameOver=false;this.sprites={fighter:{idle:new Image(),move:new Image(),attack1:new Image(),attack2:new Image(),damage:new Image(),destroyed:new Image(),turn1:new Image(),turn2:new Image()},meteors:[]};this.loadSprites();this.player={x:this.canvas.width/2-25,y:this.canvas.height-80,width:50,height:50,speed:5,bullets:[],state:"idle",animationFrame:0,animationCounter:0,damaged:false,damagedTimer:0,lives:3};this.keys={};this.obstacles=[];this.lastObstacleTime=0;this.obstacleInterval=1000;this.backgroundStars=this.createStars();this.setupEventListeners()}loadSprites(){const basePath="https://mdfernandezjr.github.io/projects/02/sprites/";const loadImage=(src)=>{return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error(`Failed to load image: ${src}`));img.src=src})};Promise.all([loadImage(basePath+"Fighter/Idle.png").then(img=>{this.sprites.fighter.idle=img}),loadImage(basePath+"Fighter/Move.png").then(img=>{this.sprites.fighter.move=img}),loadImage(basePath+"Fighter/Attack_1.png").then(img=>{this.sprites.fighter.attack1=img}),loadImage(basePath+"Fighter/Attack_2.png").then(img=>{this.sprites.fighter.attack2=img}),loadImage(basePath+"Fighter/Damage.png").then(img=>{this.sprites.fighter.damage=img}),loadImage(basePath+"Fighter/Destroyed.png").then(img=>{this.sprites.fighter.destroyed=img}),loadImage(basePath+"Fighter/Turn_1.png").then(img=>{this.sprites.fighter.turn1=img}),loadImage(basePath+"Fighter/Turn_2.png").then(img=>{this.sprites.fighter.turn2=img}),...["Meteor_02.png","Meteor_03.png","Meteor_06.png","Meteor_07.png","Meteor_10.png"].map(name=>loadImage(basePath+name).then(img=>{this.sprites.meteors.push(img)}))]).then(()=>{console.log("All sprites loaded successfully");this.gameLoop()}).catch(error=>{console.error("Error loading sprites:",error);this.ctx.fillStyle="white";this.ctx.font="20px Arial";this.ctx.fillText("Error loading game assets. Check console.",20,50)})}createStars(){const stars=[];for(let i=0;i<100;i++){stars.push({x:Math.random()*this.canvas.width,y:Math.random()*this.canvas.height,size:Math.random()*2+1,speed:Math.random()*2+1})}return stars}setupEventListeners(){document.addEventListener("keydown",(e)=>{this.keys[e.key]=true;if(e.key===" "&&!this.gameOver){this.shoot()}});document.addEventListener("keyup",(e)=>{this.keys[e.key]=false})}shoot(){if(!this.gameOver){this.player.bullets.push({x:this.player.x+this.player.width/2-2,y:this.player.y,width:4,height:10,speed:7});this.player.state="attack1";this.player.animationFrame=0;this.player.animationCounter=0}}updatePlayerState(){if(this.gameOver){this.player.state="destroyed";return}if(this.player.damaged){this.player.state="damage";this.player.damagedTimer++;if(this.player.damagedTimer>30){this.player.damaged=false;this.player.damagedTimer=0}}else if(this.keys["ArrowLeft"]&&!this.keys["ArrowRight"]){this.player.state="turn1"}else if(this.keys["ArrowRight"]&&!this.keys["ArrowLeft"]){this.player.state="turn2"}else if(this.keys["ArrowUp"]||this.keys["ArrowDown"]){this.player.state="move"}else if(this.player.state==="attack1"||this.player.state==="attack2"){this.player.animationCounter++;if(this.player.animationCounter>10){this.player.state="idle"}}else{this.player.state="idle"}}handleCollision(){this.player.lives--;if(this.player.lives<=0){this.gameOver=true;document.getElementById("gameOver").style.display="block";document.getElementById("finalScore").textContent=this.score}else{this.player.damaged=true;this.player.damagedTimer=0}}update(){if(this.gameOver)return;this.updatePlayerState();if(this.keys["ArrowLeft"])this.player.x=Math.max(0,this.player.x-this.player.speed);if(this.keys["ArrowRight"])this.player.x=Math.min(this.canvas.width-this.player.width,this.player.x+this.player.speed);if(this.keys["ArrowUp"])this.player.y=Math.max(0,this.player.y-this.player.speed);if(this.keys["ArrowDown"])this.player.y=Math.min(this.canvas.height-this.player.height,this.player.y+this.player.speed);this.player.bullets=this.player.bullets.filter(bullet=>{bullet.y-=bullet.speed;return bullet.y>0});this.backgroundStars.forEach(star=>{star.y+=star.speed;if(star.y>this.canvas.height){star.y=0;star.x=Math.random()*this.canvas.width}});const currentTime=Date.now();if(currentTime-this.lastObstacleTime>this.obstacleInterval){const size=Math.random()*30+40;const meteorIndex=Math.floor(Math.random()*this.sprites.meteors.length);this.obstacles.push({x:Math.random()*(this.canvas.width-size),y:-size,width:size,height:size,speed:Math.random()*2+2,meteorIndex:meteorIndex,rotation:Math.random()*Math.PI*2,rotationSpeed:(Math.random()-0.5)*0.1});this.lastObstacleTime=currentTime}let obstaclesDestroyed=[];let bulletsToRemove=[];this.obstacles.forEach((obstacle,obstacleIndex)=>{obstacle.y+=obstacle.speed;obstacle.rotation+=obstacle.rotationSpeed;this.player.bullets.forEach((bullet,bulletIndex)=>{if(this.checkCollision(bullet,obstacle)){obstaclesDestroyed.push(obstacleIndex);bulletsToRemove.push(bulletIndex);this.score+=10;document.getElementById("score").textContent=`Score: ${this.score}`}});if(this.checkCollision(this.player,obstacle)){obstaclesDestroyed.push(obstacleIndex);this.handleCollision()}});bulletsToRemove.reverse().forEach(index=>{this.player.bullets.splice(index,1)});obstaclesDestroyed.reverse().forEach(index=>{this.obstacles.splice(index,1)});this.obstacles=this.obstacles.filter(obstacle=>obstacle.y<this.canvas.height)}checkCollision(rect1,rect2){const r1w=rect1.width*0.8;const r1h=rect1.height*0.8;const r2w=rect2.width*0.8;const r2h=rect2.height*0.8;return(rect1.x+rect1.width*0.1)<(rect2.x+rect2.width*0.1+r2w)&&(rect1.x+rect1.width*0.1+r1w)>(rect2.x+rect2.width*0.1)&&(rect1.y+rect1.height*0.1)<(rect2.y+rect2.height*0.1+r2h)&&(rect1.y+rect1.height*0.1+r1h)>(rect2.y+rect2.height*0.1)}getPlayerSprite(){switch(this.player.state){case"idle":return this.sprites.fighter.idle;case"move":return this.sprites.fighter.move;case"attack1":return this.sprites.fighter.attack1;case"attack2":return this.sprites.fighter.attack2;case"damage":return this.sprites.fighter.damage;case"destroyed":return this.sprites.fighter.destroyed;case"turn1":return this.sprites.fighter.turn1;case"turn2":return this.sprites.fighter.turn2;default:return this.sprites.fighter.idle}}draw(){this.ctx.fillStyle="#000033";this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);this.ctx.fillStyle="#FFF";this.backgroundStars.forEach(star=>{this.ctx.beginPath();this.ctx.arc(star.x,star.y,star.size,0,Math.PI*2);this.ctx.fill()});this.ctx.save();this.ctx.translate(this.player.x+this.player.width/2,this.player.y+this.player.height/2);this.ctx.rotate(-Math.PI/2);const playerSprite=this.getPlayerSprite();this.ctx.drawImage(playerSprite,-(this.player.width/2),-(this.player.height/2),this.player.width,this.player.height);this.ctx.restore();this.ctx.fillStyle="#FF0";this.player.bullets.forEach(bullet=>{this.ctx.fillRect(bullet.x,bullet.y,bullet.width,bullet.height)});this.obstacles.forEach(obstacle=>{this.ctx.save();this.ctx.translate(obstacle.x+obstacle.width/2,obstacle.y+obstacle.height/2);this.ctx.rotate(obstacle.rotation);const meteorSprite=this.sprites.meteors[obstacle.meteorIndex];this.ctx.drawImage(meteorSprite,-obstacle.width/2,-obstacle.height/2,obstacle.width,obstacle.height);this.ctx.restore()});this.ctx.fillStyle="white";this.ctx.font="20px Arial";this.ctx.fillText(`Lives: ${this.player.lives}`,10,30)}gameLoop(){this.update();this.draw();requestAnimationFrame(()=>this.gameLoop())}}function restartGame(){document.getElementById("gameOver").style.display="none";document.getElementById("score").textContent="Score: 0";window.game=new Game()}window.onload=()=>{window.game=new Game()};
