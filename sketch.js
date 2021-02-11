var PLAY = 1;
var END = 0;
var gameState = PLAY;

var distance=11000

var trex, trex_running, trex_collided;
var ground, groundImage, invisibleGround;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var touches = []

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  if(windowWidth<1000){
    if(windowHeight<500){
      createCanvas(windowWidth, windowHeight);
    } else{
      createCanvas(windowWidth, 500)}
  } else{
    if(windowHeight<500){
      createCanvas(1000, windowHeight);
    } else{
      createCanvas(1000, 500)
    }
  }
  trex = createSprite(50,height-70,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  //console.log("hello")

  gameOver = createSprite(width/2,height/2-40);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-40,width,10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  console.log(trex.x)
  trex.debug = true;
  trex.setCollider("rectangle", 0, 0, 50, 80, 45);
  if(windowWidth<1000){
    camera.position.x=trex.x+(width/2)-50
  } else{
    camera.position.x=trex.x+(500)-50
  }
  invisibleGround.x=trex.x-50+width/2
  background(255);
  if(windowWidth<1000){
    text("Your screen is too small to display the score", 100,50);
    text("High Score: "+ localStorage["HighestScore"], width-250, 100)
  } else{
    text("Score: "+ score, trex.x+850,50);
    text("High Score: "+ localStorage["HighestScore"], trex.x+700, 50)
  }
  
  if (gameState===PLAY){
    score += Math.round(getFrameRate()/60);
    //distance+=(6 + 3*score/100);
  
    obstaclesGroup.setLifetimeEach(6 + 3*score/100);
    cloudsGroup.setLifetimeEach(6 + 3*score/100);

    if((touches.length>0 || keyDown("space")) && trex.y >= height-70) {
      trex.velocityY = -12;
      touches =[]
    }
  
    trex.velocityY = trex.velocityY + 0.8
    trex.velocityX = (6 + 3*score/100);

    trex.collide(invisibleGround);
    spawnClouds();
    //if (frameCount-10 % 100 === 0) {
      spawnObstacles();
    //}
    spawnGround();
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        trex.velocityX=0
    }
  }
  else if (gameState === END) {
    gameOver.x=trex.x+width/2-50
    restart.x=trex.x+width/2-50

    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    //ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  
  //if (frameCount % 100 === 0) {
    for(i=500; i<distance; i+=500) {
      var cloud = createSprite(width,height+20,40,10);
      cloud.y = Math.round(random(height-100,height-300));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = 1;
      
      //assign lifetime to the variable
      cloud.lifetime = (6 + 3*score/100)
      
      //adjust the depth
      cloud.depth = trex.depth;
      trex.depth = trex.depth + 1;
      
      //add each cloud to the group
      cloudsGroup.add(cloud);
    }
  //}
  
}

function spawnObstacles() {
  //obstacleDistance=trex.x+2000
  //if (frameCount-10 % 100 === 0) {
    for(i=400; i<distance; i+=400){
      //if (frameCount % 40 === 0) {
      var obstacle = createSprite(i,height-60,10,40);
      obstacle.scale = 0.4;
      obstacle.lifetime = (6 + 3*score/100)
      obstaclesGroup.add(obstacle);
      //generate random obstacles
      var rand = Math.round(random(1,6));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
            break;
        case 2: obstacle.addImage(obstacle2);
            break;
        case 3: obstacle.addImage(obstacle3);
            break;
        case 4: obstacle.addImage(obstacle4);
            break;
        case 5: obstacle.addImage(obstacle5);
            break;
        case 6: obstacle.addImage(obstacle6);
            break;
        default: break;
    }
  //}
   //}
    
    //assign scale and lifetime to the obstacle           
    
    //add each obstacle to the group
    
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  //console.log(localStorage["HighestScore"]);
  trex.x = 50
  score = 0;
  
}
function spawnGround(){
  
    for(i=width/2; i<distance; i+=width){
      //console.log(i)
      ground = createSprite(i,height-50,width,20);
      ground.addImage("ground",groundImage);
      ground.x = ground.width /2;
      ground.lifetime = (6 + 3*score/100)
    }
  
}
/*var PLAY = 1;
var END = 0;
var gameState = PLAY;

var distance=2000

var trex, trex_running, trex_collided;
var ground, groundImage, invisibleGround;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var touches = []

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  if(windowWidth<1000){
    if(windowHeight<500){
      createCanvas(windowWidth, windowHeight);
    } else{
      createCanvas(windowWidth, 500)}
  } else{
    if(windowHeight<500){
      createCanvas(1000, windowHeight);
    } else{
      createCanvas(1000, 500)
    }
  }
  trex = createSprite(50,height-70,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  //console.log("hello")

  gameOver = createSprite(width/2,height/2-40);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-40,width,10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  console.log(trex.x)
  trex.debug = true;
  trex.setCollider("rectangle", 0, 0, 50, 80, 45);
  if(windowWidth<1000){
    camera.position.x=trex.x+(width/2)-50
  } else{
    camera.position.x=trex.x+(500)-50
  }
  invisibleGround.x=trex.x-50+width/2
  background(255);
  if(windowWidth<1000){
    text("Your screen is too small to display the score", 100,50);
    text("High Score: "+ localStorage["HighestScore"], width-250, 100)
  } else{
    text("Score: "+ score, trex.x+850,50);
    text("High Score: "+ localStorage["HighestScore"], trex.x+700, 50)
  }
  
  if (gameState===PLAY){
    score += Math.round(getFrameRate()/60);
    distance+=(6 + 3*score/100);
  
    if((touches.length>0 || keyDown("space")) && trex.y >= height-70) {
      trex.velocityY = -12;
      touches =[]
    }
  
    trex.velocityY = trex.velocityY + 0.8
    trex.velocityX = (6 + 3*score/100);

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnGround();
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        trex.velocityX=0
    }
  }
  else if (gameState === END) {
    gameOver.x=trex.x+width/2-50
    restart.x=trex.x+width/2-50

    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  
  if (frameCount % 100 === 0) {
    for(i=500; i<distance; i+=500) {
      var cloud = createSprite(width,height+20,40,10);
      cloud.y = Math.round(random(height-100,height-300));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = 1;
      
      //assign lifetime to the variable
      cloud.lifetime = (6 + 3*score/100)
      
      //adjust the depth
      cloud.depth = trex.depth;
      trex.depth = trex.depth + 1;
      
      //add each cloud to the group
      cloudsGroup.add(cloud);
    }
  }
  
}

function spawnObstacles() {
  //obstacleDistance=trex.x+2000
  if (frameCount-10 % 100 === 0) {
    for(i=400; i<distance; i+=400){
      //if (frameCount % 40 === 0) {
      var obstacle = createSprite(i,height-60,10,40);
      obstacle.scale = 0.4;
      obstacle.lifetime = (6 + 3*score/100)
      obstaclesGroup.add(obstacle);
      //generate random obstacles
      var rand = Math.round(random(1,6));
      switch(rand) {
        case 1: obstacle.addImage(obstacle1);
            break;
        case 2: obstacle.addImage(obstacle2);
            break;
        case 3: obstacle.addImage(obstacle3);
            break;
        case 4: obstacle.addImage(obstacle4);
            break;
        case 5: obstacle.addImage(obstacle5);
            break;
        case 6: obstacle.addImage(obstacle6);
            break;
        default: break;
    }
  }
   //}
    
    //assign scale and lifetime to the obstacle           
    
    //add each obstacle to the group
    
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  //console.log(localStorage["HighestScore"]);
  trex.x = 50
  score = 0;
  
}
function spawnGround(){
  if (frameCount-10 % 100 === 0) {
    for(i=width/2; i<distance+width; i+=width){
      //console.log(i)
      ground = createSprite(i,height-50,width,20);
      ground.addImage("ground",groundImage);
      ground.x = ground.width /2;
      ground.lifetime = (6 + 3*score/100)
    }
  }
}*/
/**var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50,height-70,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-50,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2-40);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-40,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  text("Score: "+ score, width-100,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if((touches.length>0 || keyDown("space")) && trex.y >= height-70) {
      trex.velocityY = -12;
      touches =[]
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width,height+20,40,10);
    cloud.y = Math.round(random(height-100,height-300));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = width/3;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-60,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = width/(6+3*score/100);
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}**/