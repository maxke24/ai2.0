function Bird(brain) {
  this.y = height/2;
  this.x = 64;

  this.gravity = 0.6;
  this.lift = -12;
  this.velocity = 0;
  this.score = 0;
  this.fitness = 0;
  if (brain){
    this.brain = brain.copy();
  }else{
  this.brain = new NeuralNetwork(6, 6, 2);
  }

  this.show = function() {
    fill(255);
    ellipse(this.x, this.y, 32, 32);
  }

  this.up = function() {
    this.velocity += this.lift;
  }

  this.think = function(pipes) {
    let closest = null;
    let closestD = Infinity;
    for (let i = 0; i < pipes.length; i++) {
        let d = (pipes[i].x + pipes[i].w)- this.x;
        if (d < closestD && d > 0) {
        closest = pipes[i];
        closestD = d;
      }
    }

    let inputs = [];
    inputs[0] = this.y/height;
    inputs[1] = this.x/width;
    inputs[2] = closest.top/height;
    inputs[3] = closest.bottom/height;
    inputs[4] = closest.x/width;
    inputs[5] = this.velocity;

    let output = this.brain.predict(inputs);
    if (output[0] > output[1]) {
      this.up();
    }
  }

  this.mutate = function(mutationRate){
    this.brain.mutate(mutationRate);
  }

  this.update = function() {
    this.score++;
    this.velocity += this.gravity;
    // this.velocity *= 0.9;
    this.y += this.velocity;

    // if (this.y > height) {
    //   this.y = height;
    //   this.velocity = 0;
    // }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }

  this.offScreen = function(){
    return this.y > height;
  }

}
