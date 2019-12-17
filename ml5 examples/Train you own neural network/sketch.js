let model;
let targetLabel = "C";

let state = "collection";

let notes = {
  C: 261.6256,
  D: 293.6648,
  E: 329.6276,
  F: 349.2282,
  G: 391.9954,
  A: 440.0,
  B: 493.8833
};

let env, wave;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(51);

  env = new p5.Envelope();
  env.setADSR(0.05, 0.1, 0.5, 1);
  env.setRange(1.2, 0);

  wave = new p5.Oscillator();

  wave.setType('sine');
  wave.start();
  wave.freq(440);
  wave.amp(env);

   let options = {
     inputs: ['x', 'y'],
     outputs: ['frequency'],
     task: 'regression',
     debug: 'true',
     learningRate: 0.5
   };
   model = ml5.neuralNetwork(options);
   // model.loadData("savedData/mouse-notes.json", dataLoaded);
   const modelInfo = {
     model: 'savedModel/model.json',
     metadata:'savedModel/model_meta.json',
     weights: "savedModel/model.weights.bin"
   }
   // model.load(modelInfo, modelLoaded);

}

function modelLoaded(){
  console.log("model is loaded");
}

function keyPressed() {
  if(key == 't'){
    state = 'training';
    model.normalizeData();
    let options = {
      epochs: 200
    }
    model.train(options, finishedTraining);
  }else if(key == 's'){
    model.saveData('mouse-notes');
  }else if(key == 'm'){
    model.save('mouse-notes');
  }else if(key == 'i'){
    state = 'classification';
  }else if(key == 'p'){
    state = "prediction"
  }else{
    targetLabel = key.toUpperCase();
  }
}

function whileTraining(epoch, loss){
  console.log(epoch);
}

function finishedTraining() {
  state = "prediction";
  console.log("Finished training");
}

function mousePressed() {
  let inputs = {
    x: mouseX,
    y: mouseY
  }
  if(state == 'collection'){
    let targetFrequency = notes[targetLabel]
    let targets = {
      frequency: targetFrequency
    }
  model.addData(inputs, targets);
  stroke(0);
  fill(255);
  noFill();
  ellipse(mouseX, mouseY, 24);
  textAlign(CENTER, CENTER);
  text(targetLabel, mouseX, mouseY);
  wave.freq(targetFrequency);
  env.play();
}else if(state == "prediction"){
  model.predict(inputs, gotResults);
}
}

function dataLoaded(){
  let data = model.data.data.raw;
  for(let i = 0; i < data.length; i++){
    let inputs = data[i].xs;
    let target = data[i].ys;
    stroke(0);
    fill(255);
    noFill();
    ellipse(inputs.x, inputs.y, 24);
    textAlign(CENTER, CENTER);
    text(target.label, inputs.x, inputs.y);
  }

}

function gotResults(error, results){
  if(error){
    console.log(error);
    return;
  }else{
    console.log(results)
    stroke(0);
    fill(0, 0, 255, 100);
    ellipse(mouseX, mouseY, 24);
    textAlign(CENTER, CENTER);
    let label = results[0].value;
    text(floor(label), mouseX, mouseY);
    wave.freq(label);
    env.play();
  }
}

// function draw() {
//   background(51);
//
// }
