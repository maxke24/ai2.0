let X;
let Y;
let outerLine = [];
let innerLine = [];
let inner = false;
let ball;
let seg;
let color = 255;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(51);
  X = width / 2;
  Y = height / 2;
  ball = new Ball(0, 0);
}

function draw() {
  background(51);
  translate(X, Y);
  if (keyIsDown(37) === true){
    ball.x -= 1.5;

  }
  if (keyIsDown(38) === true){
    ball.y -= 1.5;

  }
  if (keyIsDown(39) === true){
    ball.x += 1.5;
  }
  if (keyIsDown(40) === true){
    ball.y += 1.5;

  }
  ball.display();
  drawOutline();
  drawInnerLine();
  collisionDetection(outerLine);
  collisionDetection(innerLine);
}

function keyPressed(){
  if (key === "d"){
    inner = true;
  }
}

function mousePressed() {
  let cor = createVector(mouseX - X, mouseY - Y);
  if (inner){
    innerLine.push(cor);
  }else{
    outerLine.push(cor);
  }
}

function drawOutline() {
  beginShape();
  stroke(255);
  noFill();
  for (let i = 0; i < outerLine.length; i++){
    let x = outerLine[i].x;
    let y = outerLine[i].y;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawInnerLine(){
  beginShape();
  stroke(255);
  noFill();
  for (let i = 0; i < innerLine.length; i++){
    let x = innerLine[i].x;
    let y = innerLine[i].y;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function collisionDetection(line) {
  ball.collision = false;
  if (line.length > 0){
    for (let i = 0; i < line.length; i++){
      let originX = ball.x;
      let originY = ball.y;
      let x1 = line[i].x - originX;
      let y1 = line[i].y - originY;
      let x2 = 0;
      let y2 = 0;
      if (i === line.length-1){
        x2 = line[0].x - originX;
        y2 = line[0].y - originY;
      }else{
        x2 = line[i + 1].x - originX;
        y2 = line[i + 1].y - originY;
      }
      let r = 8;
      let dx = x2 - x1;
      let dy = y2 - y1;
      let dr = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      let D = x1 * y2 - x2 * y1;
      let delta = Math.pow(r, 2)*Math.pow(dr, 2) - Math.pow(D, 2);
      if (delta === 0){
        ball.collision = true;
      } else if (delta > 0){
        ball.collision = true;
      }
  }
  }
}
