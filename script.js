let img;
let shapes = [];
let draggingShape = null;
let img1;
let img2;
let timer = 5;
let levelCompleted = false;
let attemptFailed = false;
let attemptFailedTime = 0; 
let submitButton;
let mode = 1;
let nextLvlButton;
let gameOver = false;
let home;

function preload() {
  img = loadImage('background3.jpg');
  img1 = loadImage('cropped3.png');
  img2 = loadImage('level2.png');
  home = loadImage('61972.png');
}

function setup() {
  createCanvas(600, 400);
  setupLevel();

  img1.resize(350, 400);
  img2.resize(350, 350);
  home.resize(25,25);

  homeButton = new Button(10,10,home);

  submitButton = createButton('Submit');
  submitButton.position(300, 350);
  submitButton.mousePressed(checkAllPlacements);

  nextLvlButton = createButton('Next Level');
  nextLvlButton.position(300, 375);
  nextLvlButton.hide();
  nextLvlButton.mousePressed(() => {
    if (mode === 2) {
      gameOver = true; 
    } else {
      mode = 2;
      levelCompleted = false;
      attemptFailed = false;
      timer = 5;
      setupLevel();
      submitButton.show();
      nextLvlButton.hide();
    }
  });
}

function draw() {
  background(img);
  textSize(40);
  fill(0);
  textAlign(LEFT, TOP);
  text(timer, 40, 20);

  homeButton.display();
  if (homeButton.over()){
window.location.replace("https://ashnguyenn.github.io/fse100/");
  }

  if (frameCount % 60 == 0 && timer > 0) {
    timer--;
  }

  if (timer > 0 && !gameOver) {
    if (mode === 1) {
      image(img1, 0, 0);
    } else if (mode === 2) {
      image(img2, 0, 0);
    }
  }

  for (let shape of shapes) {
    shape.display();
  }

  if (gameOver) {
    textSize(30);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Good Job! You completed the game!", width / 2, height / 2);
    submitButton.hide();
    nextLvlButton.hide();
  } else if (levelCompleted) {
    textSize(60);
    fill(255);
    textAlign(CENTER, CENTER);
    text("Level Completed!", width / 2, height / 2);
    nextLvlButton.show();
    submitButton.hide();
  } else if (attemptFailed) {
    textSize(60);
    fill('red');
    textAlign(CENTER, CENTER);
    text("Try Again!", width / 2, height / 2);

   
    if (frameCount - attemptFailedTime > 90) {
      attemptFailed = false; 
    }
  }
}

function mousePressed() {
  if (!levelCompleted && !attemptFailed && timer === 0 && !gameOver) {
    for (let shape of shapes) {
      if (shape.contains(mouseX, mouseY)) {
        draggingShape = shape;
        shape.offsetX = mouseX - shape.x;
        shape.offsetY = mouseY - shape.y;
        break;
      }
    }
  }
}

function mouseDragged() {
  if (draggingShape) {
    draggingShape.x = mouseX - draggingShape.offsetX;
    draggingShape.y = mouseY - draggingShape.offsetY;
  }
}

function mouseReleased() {
  if (draggingShape) {
    draggingShape = null;
  }
}

function checkAllPlacements() {
  let correctPositions;
  let tolerance = mode === 1 ? 30 : 50; 

  if (mode === 1) {
    correctPositions = [
      { type: 'triangle', x: 111, y: 186 },
      { type: 'triangle', x: 223, y: 189 },
      { type: 'circle', x: 165, y: 253 }
    ];
  } else if (mode === 2) {
    correctPositions = [
      { type: 'rectangle', x: 101, y: 143 },
      { type: 'rectangle', x: 215, y: 143 },
      { type: 'circle', x: 105, y: 202 },
      { type: 'circle', x: 229, y: 207 },
      { type: 'triangle', x: 163, y: 239 },
      { type: 'rectangle', x: 169, y: 283 }
    ];
  }

  let correctCount = 0;

  for (let position of correctPositions) {
    for (let shape of shapes) {
      if (
        shape.type === position.type &&
        dist(shape.x, shape.y, position.x, position.y) < tolerance
      ) {
        correctCount++;
      }
    }
  }

  if (correctCount === correctPositions.length) {
    levelCompleted = true;
    attemptFailed = false;
    nextLvlButton.show();
    submitButton.hide();
  } else {
    attemptFailed = true;
    attemptFailedTime = frameCount; 
    levelCompleted = false;
  }
}

function setupLevel() {
  shapes = [];

  
  shapes.push(new Draggable('triangle', 395, 149));
  shapes.push(new Draggable('triangle', 459, 152));
  shapes.push(new Draggable('triangle', 523, 151));
  shapes.push(new Draggable('rectangle', 393, 203));
  shapes.push(new Draggable('rectangle', 458, 203));
  shapes.push(new Draggable('rectangle', 526, 202));
  shapes.push(new Draggable('triangle', 392, 257));
  shapes.push(new Draggable('rectangle', 459, 251));
  shapes.push(new Draggable('circle', 526, 255));
  shapes.push(new Draggable('circle', 426, 310));
  shapes.push(new Draggable('rectangle', 486, 311));
}

class Draggable {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  display() {
    fill(0);
    if (this.type === 'triangle') {
      triangle(this.x, this.y - 25, this.x - 25, this.y + 25, this.x + 25, this.y + 25);
    } else if (this.type === 'rectangle') {
      rect(this.x - 25, this.y - 12, 50, 24);
    } else if (this.type === 'circle') {
      ellipse(this.x, this.y, 50, 50);
    }
  }

  contains(px, py) {
    if (this.type === 'triangle') {
      return px > this.x - 25 && px < this.x + 25 && py > this.y - 25 && py < this.y + 25;
    } else if (this.type === 'rectangle') {
      return px > this.x - 25 && px < this.x + 25 && py > this.y - 12 && py < this.y + 12;
    } else if (this.type === 'circle') {
      let d = dist(px, py, this.x, this.y);
      return d < 25;
    }
  }
}

class Button {  
  constructor(inX, inY, inImg) {
    this.x = inX;
    this.y = inY;
    this.img = inImg;
  }

  pressed(mode){
    if (mode == 1){
      console.log("pressed 1");
    } else if (mode == 2){
      console.log("pressed 2");
    } else if (mode == 3){
      console.log("pressed 3");
    } else if (mode == 4){
      console.log("pressed 4");
    }
  }

  display() {
    stroke(0);
    image(this.img, this.x, this.y);
  }

  over() {
    if (mouseX > this.x && mouseX < this.x + this.img.width
        && mouseY >
        this.y && mouseY < this.y + this.img.height) {
      return true;
    } else {
      return false;
    }
  }
  hide(){
    this.alpha = 0;
  }
}
