let mr = 0.02

class Vehicle {
  constructor(x, y, dna) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 4;
    this.maxspeed = random(2, 6);
    this.maxforce = random(0.2, 0.6);
    this.imunity = random(0.004, 0.01);
    this.health = 1;

    this.dna = [];
    if(dna === undefined){
      // food Weight
      this.dna[0] = random(-2, 2);
      // poison weight
      this.dna[1] = random(-2, 2);
      // food perception
      this.dna[2] = random(0, 100);
      // poison perception
      this.dna[3] = random(0, 100);
    }else{
      //mutation
      for (let i = 0; i < dna.length / 2; i++){
        this.dna[i] = dna[i];
        if (random(1)<mr){
          this.dna[i] += random(-0.1, 0.1);
        }
      }for (let i = dna.length / 2; i < dna.length; i++){
        this.dna[i] = dna[i];
        if (random(1)<mr){
          this.dna[i] += random(-10, 10);
        }
      }
    }

    
  }

  // Method to update location
  update() {
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
      strokeWeight(3);
  
      stroke(0, 255, 0);
      noFill();
      line(0, 0, 0, -this.dna[0] * 25);
      ellipse(0, 0, this.dna[2]*2);
      strokeWeight(2);
      stroke(255, 0, 0);
      line(0, 0, 0, -this.dna[1] * 25);
      ellipse(0, 0, this.dna[3]*2);

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

  eat(list, nutrition, perception){
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

  behaviors(good, bad){
    let steerG = this.eat(good, 0.3, this.dna[2]);
    let steerB = this.eat(bad, -0.75, this.dna[3]);
    
    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }

  dead(){
    return (this.health<0);
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
      return new Vehicle(this.position.x, this.position.y, this.dna);
    }else{
      return null;
    }
  }
}