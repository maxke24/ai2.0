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
  if (inner){
    innerLine.push([mouseX - X, mouseY - Y]);

  }else{
    outerLine.push([mouseX - X, mouseY  - Y]);

  }
}

function drawOutline() {
  beginShape();
  stroke(255);
  noFill();
  for (let i = 0; i < outerLine.length; i++){
    let x = outerLine[i][0];
    let y = outerLine[i][1];
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawInnerLine(){
  beginShape();
  stroke(255);
  noFill();
  for (let i = 0; i < innerLine.length; i++){
    let x = innerLine[i][0];
    let y = innerLine[i][1];
    vertex(x, y);
  }
  endShape(CLOSE);
}

function collisionDetection(line) {
  for (let i = 0; i < line.length; i++){
    let points = [];
    if (i + 1 != line.length){
      points = [line[i], line[i + 1]];
    }else{
      points = [line[i], line[0]];
    }
    console.log(points);
    if (line.length > 1){
      let m = slope(points);
      let b = intercept(points, m);
      let x1 = points[0][0];
      let x2 = points[1][0];
      let y1 = points[0][1];
      let y2 = points[1][1];
      if (x2 < x1){
        x1, x2 = x2, x1;
      }
      if (y2 < y1){
        y1, y2 = y2, y1;
      }
      for (let i = x1; i < x2; i+= 16) {
        let y = m * i + b;
        ellipse(i, y, 16, 16);
      }
      for (let i = y1; i < y2; i+= 16) {
        let x = (i - b) / m;
        ellipse(x, i, 16, 16);
      }
    }
  }
}

function slope(line){
  let x1 = line[0][0];
  let y1 = line[0][1];
  let x2 = line[1][0];
  let y2 = line[1][1];
  return (y2 - y1) / (x2 - x1);

}

function intercept(line, m){
  let x = line[0][0];
  let y = line[0][1];
  return b = y - m * x;

}
