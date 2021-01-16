var PLAY = 1;
var END = 0;
var gameState = PLAY;

var harry, harry_flying, harry_collided;
var  invisibleGround;

var potionsGroup, potion1Image, potion2Image;
var ghostsGroup, ghost1, ghost2, ghost3

var sky, skyImage;
var moon, moonImage

var score=0;

localStorage["HighestScore"] = 0;

function preload(){
  harry_flying =   loadAnimation("image/harryP3.png");
  
  harry_falling = loadAnimation("image/falling1.png");
  
  harry_collided = loadAnimation("image/falling1.png");
 
  potion1Image = loadImage("image/potion1.png");
  potion2Image = loadImage("image/potion2.png");
  
  ghost1 = loadImage("image/ghost1.png");
  ghost2 = loadImage("image/ghost2.png");

  skyImage = loadImage("image/sky.jpg");

  moonImage = loadImage("image/moon.png");

  ghost3 = loadImage("image/ghost3.png");
}

function setup() {
  createCanvas(displayWidth-10, displayHeight-130);
  
  sky = createSprite(width/2,height/2,10,10)
  sky.addImage(skyImage);
  sky.scale = 1.3;
  sky.velocityX = -4;

  harry = createSprite(200,180,20,50);
  harry.addAnimation("flying", harry_flying);
  harry.addAnimation("falling", harry_falling);
  harry.addAnimation("collided", harry_collided);
  harry.scale = 0.4;
  //harry.debug = true;
  harry.setCollider("rectangle",0,0,600,harry.height-100);
  
  moon = createSprite(1000,100,10,10);
  moon.velocityX = -0.2;
  moon.addImage(moonImage);
  moon.scale = 0.3;
  
  invisibleGround = createSprite(width/2,height+100,width,10);
  invisibleGround.visible = false;
  
  potionsGroup = new Group();
  ghostsGroup = new Group();
  
  score = 0;
}

function draw() {
  background(0);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);

    spawnPotions();
    spawnGhosts();
  
    if(harry.isTouching(potionsGroup)){
      potionsGroup.setLifetimeEach(0);
    } 

    if(sky.x < 600){
      sky.x = width/2;
    }

    if(ghostsGroup.isTouching(harry)){
        gameState = END;
    }

    if(keyDown("up")){
      harry.velocityY = -6;
    }

    if(keyDown("down")){
      harry.velocityY = 6;
    }
  }
  else if (gameState === END) {
    sky.x = sky.width/2;
    
    harry.velocityY = 10;
    harry.scale = 0.3;
    ghostsGroup.setVelocityXEach(0);
    potionsGroup.setVelocityXEach(0);
    
    moon.velocityX = 0;
    
    harry.changeAnimation("falling",harry_falling);
    harry.collide(invisibleGround);
    if(harry.isTouching(invisibleGround)){
      harry.changeAnimation("collided",harry_collided);
    }
 
    ghostsGroup.setLifetimeEach(-1);
    potionsGroup.setLifetimeEach(-1);
  }
    drawSprites();
}

function spawnPotions() {
 
  if (frameCount % 40 === 0) {
    var potion = createSprite(600,120,40,10);
    potion.y = Math.round(random(80,600));
    var r = Math.round(random(1,2));

    switch (r) {
     case 1: potion.addImage(potion1Image);
     break
     case 2: potion.addImage(potion2Image);
    }
   
    potion.scale = 0.2;
    potion.velocityX = -3;
    potion.lifetime = 80;
    potion.depth = harry.depth;
    harry.depth = harry.depth + 1;
   
    potionsGroup.add(potion);
  }
}

function spawnGhosts() {
  if(frameCount % 160 === 0) {
    var ghost = createSprite(width,165,10,40);
    
    ghost.y = Math.round(random(100,700));
    ghost.velocityX = -(6 + 2*score/100);
    
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: ghost.addImage(ghost1);
              break;
      case 2: ghost.addImage(ghost2);
              break;
      case 3: ghost.addImage(ghost3);
              break;
      case 4: ghost.addImage(ghost1);
              break;
      case 5: ghost.addImage(ghost2);
              break;
      case 6: ghost.addImage(ghost3);
              break;
      default: break;
    }
             
    ghost.scale = 0.5;
    ghost.lifetime = 300;
    ghost.debug = false;
    
    ghostsGroup.add(ghost);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  ghostsGroup.destroyEach();
  potionsGroup.destroyEach();
  
  harry.changeAnimation("flying",harry_flying);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
}