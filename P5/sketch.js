let vehicles = [];
let food = [];
let poison = [];
let debug = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    vehicles[i] = new Vehicle(x, y);
  }
  for (let i = 0; i < 40; i++){
    let x = random(width);
    let y = random(height);
    food.push(createVector(x, y));
  }
  for (let i = 0; i < 20; i++){
    let x = random(width);
    let y = random(height);
    poison.push(createVector(x, y));
  }
}
  
function mouseDragged(){
  vehicles.push(new Vehicle(mouseX, mouseY));
}

function keyPressed(){
  if (keyCode === 68){
    if (debug){
      debug = false;
    }else{
      debug = true;
    }
  }
}

function draw() {
  background(51);

  if(random(1)< 0.1){
      let x = random(width);
      let y = random(height);
      food.push(createVector(x, y));
  }

  if(random(1)< .05){
    let x = random(width);
    let y = random(height);
    poison.push(createVector(x, y));
}

  for (let i = 0; i < food.length; i++){
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 4, 4)
  }
  for (let i = 0; i < poison.length; i++){
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 4, 4)
  }
  for (let i = vehicles.length - 1; i >= 0; i--) {
    vehicles[i].boundaries();
    vehicles[i].behaviors(food, poison);
    vehicles[i].update();
    vehicles[i].display();

    let newVehicle = vehicles[i].clone();
    if(newVehicle != null){
      vehicles.push(newVehicle);
    }

    if (vehicles[i].dead()){
      let x = vehicles[i].position.x;
      let y = vehicles[i].position.y;
      food.push(createVector(x, y));
      vehicles.splice(i, 1);
    }
  }

}