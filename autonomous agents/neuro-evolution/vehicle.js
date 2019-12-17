let mr = 0.02

class Vehicle {
  constructor(x, y, dna, brain) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 4;
    this.maxspeed = random(2, 6);
    this.maxforce = random(0.2, 0.6);
    this.imunity = random(0.004, 0.01);
    this.health = 1;
    if(brain){
      this.brain = brain.copy();
    }else{
      this.brain = new NeuralNetwork(7, 7, 1)
    }

    this.dna = [];
    if(dna === undefined){
      // food perception
      this.dna[0] = random(0, 100);
      // poison perception
      this.dna[1] = random(0, 100);
    }else{
      //mutation
    for (let i = 0; i < dna.length; i++){
        this.dna[i] = dna[i];
        if (random(1)<mr){
          this.dna[i] += random(-10, 10);
        }
      }
    }

  }

  // Method to update location
  update() {
  // console.log(this.health);
    this.health -= this.imunity;
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {

    var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target

    // Scale to maximum speed
    desired.setMag(this.maxspeed);

    // Steering = Desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    // this.applyForce(steer);
    return steer;
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    let angle = this.velocity.heading() + PI / 2;
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);

    if(debug){
      let txt = floor((this.health)*100);
      text(txt, 0, 0);
      strokeWeight(3);
      stroke(0, 255, 0);
      noFill();
      ellipse(0, 0, this.dna[1]*2);
      strokeWeight(2);
      stroke(255, 0, 0);
      ellipse(0, 0, this.dna[2]*2);
    }

    let gr = color(0, 255, 0);
    let rd = color(255, 0, 0);
    let col = lerpColor(rd, gr, this.health);

    fill(col);
    stroke(col);
    strokeWeight(1);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);

    pop();
  }

  closest(list, perception){
    let record = Infinity;
    let closest = null;
    for(let i = list.length-1; i >= 0; i--){
      let d = this.position.dist(list[i]);
      if(d < this.maxspeed){
        list.splice(i, 1);
      }else{
        if (d < record && d < perception){
          record = d;
          closest = list[i];
        }
      }
    }
    if (closest != null){
      return this.seek(closest);
    }
    return createVector(0, 0);
  }

  behaviors(good, bad){
    let gPerception = this.dna[0];
    let bPerception = this.dna[1];
    let gClosest = this.closest(good, gPerception);
    let bClosest = this.closest(bad, bPerception);
    let inputs = [];
    inputs[0] = this.position;
    inputs[1] = this.maxspeed;
    inputs[3] = this.maxforce;
    inputs[4] = this.velocity;
    inputs[5] = gClosest.x;
    inputs[6] = gClosest.y;

    let output = this.brain.predict(inputs);

    let steerG = output;
    this.applyForce(steerG);
  }

  think(){
    let record = Infinity;
    let closest = null;
    for(let i = list.length-1; i >= 0; i--){
      let d = this.position.dist(list[i]);
      if(d < this.maxspeed){
        list.splice(i, 1);
        this.health += nutrition;
      }else{
        if (d < record && d < perception){
          record = d;
          closest = list[i];
        }
      }
    }

    if (closest != null){
      return this.seek(closest);
    }
    return createVector(0, 0);
  }

  dead(){
    return (this.health<0);
  }

  eat(list, nutrition){
    for(let i = list.length-1; i >= 0; i--){
      let foodX = list[i].x;
      let foodY = list[i].y;
      let min_x = this.position.x - this.r;
      let max_x = this.position.x + this.r;
      let min_y = this.position.x - this.r;
      let max_y = this.position.y + this.r;
      if(min_x < foodX && foodX < max_x && min_y < foodY && foodY < max_y){
        list.splice(i, 1);
        // console.log(`health += ${nutrition}`);
        // noLoop();
        this.health += nutrition;
        // console.log(this.health);
      }
    }
  }

  boundaries() {
    let d = 25;
    let desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  clone(){
    if (random(1) < 0.002){
      return new Vehicle(this.position.x, this.position.y, this.dna, this.brain);
    }else{
      return null;
    }
  }
}
