const TOTAL = 200;

let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;

let populationSize;
let score = 0;
let p;
let scoreP;
let generation = 1;
let generationP;
let slider;

function keyPressed(){
  if (key === 's'){
  let bird = birds[0];
  let json = bird.brain.serialize();
  save(json, "bid.json");
  console.log(json);
  }
}

function setup() {
  createCanvas(640, 480);
  slider = createSlider(1, 4, 1, 0.1);
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
  p = createP("population");
  scoreP = createP("score");
  generationP = createP("generation");
}

function draw() {
  background(0);
  let populationSize = birds.length;
  p.html(`population: ${populationSize}`);
  scoreP.html(`score: ${score}`);
  generationP.html(`generation: ${generation}`);
  for (let n = 0; n < slider.value(); n++) {
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;

  for (let i = pipes.length-1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();
    for (let j = 0; j < birds.length; j++) {
      if (pipes[i].hits(birds[j])) {
        savedBirds.push(birds.splice(j, 1)[0]);
      }
    }

    if (pipes[i].offscreen()) {
      score++;
      pipes.splice(i, 1);
    }
  }

  for (let i = birds.length-1; i >= 0; i--) {
    if (birds[i].offScreen()){
      savedBirds.push(birds.splice(i, 1)[0]);
    }
  }

  for(let bird of birds){
    bird.think(pipes);
    bird.update();
    bird.show();
  }

  if(birds.length ===0){
    counter = 0;
    score = 0;
    nextGeneration();
    generation++;
    pipes = [];
  }
}
}


// function keyPressed() {
//   if (key == ' ') {
//     bird.up();
//     //console.log("SPACE");
//   }
// }
