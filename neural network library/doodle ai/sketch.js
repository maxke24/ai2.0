let catsData, trainsData, rainbowsData;
let catsTraining, trainsTraining, rainbowsTraining;

let cats = {};
let trains = {};
let rainbows = {};

const LEN = 784;
const TOTALDATA = 10000;
const CAT = 0;
const RAINBOW = 1;
const TRAIN = 2;

let nn;

function preload(){
  catsData = loadBytes('data/cat.bin');
  trainsData = loadBytes('data/train.bin');
  rainbowsData = loadBytes('data/rainbow.bin');
}

function setup() {
  createCanvas(280, 280);
  background(255);

  // Preparing the data
  prepareData(cats, catsData, CAT);
  prepareData(rainbows, rainbowsData, RAINBOW);
  prepareData(trains, trainsData, TRAIN);

  // Creating the neural network
  nn = new NeuralNetwork(784, 64, 3);

  // Randomizing the data
  let training = [];
  training = training.concat(cats.training);
  training = training.concat(rainbows.training);
  training = training.concat(trains.training);
  shuffle(training, true);

  let testing = [];
  testing = testing.concat(cats.testing);
  testing = testing.concat(rainbows.testing);
  testing = testing.concat(trains.testing);
  shuffle(testing, true);

  let trainButton = document.querySelector("#train");
  let predictButton = document.querySelector("#predict");
  let guessButton = document.querySelector("#guess");
  let button = document.querySelector("#white");
  button.addEventListener("click", clearCanvas);
  let epochCounter = 1;
  trainButton.addEventListener("click", function(){
    trainEpoch(training);
    console.log(`Epoch: ${epochCounter}`);
    epochCounter++;
  });
  predictButton.addEventListener("click", function(){
    let percent = testAll(testing);
    console.log(`Percent: ${nf(percent, 2, 2)} %`);
  });
  guessButton.addEventListener("click", function(){
    let inputs = [];
    let img = get();
    img.resize(28, 28);
    img.loadPixels();
    for (let i = 0; i < LEN; i++){
      let bright = img.pixels[i*4];
      inputs[i] = (255-bright) / 255.0;

    }
    let guess = nn.predict(inputs);
    let m = max(guess);
    let classification = guess.indexOf(m);
    switch (classification) {
      case 0:
        console.log("cat");
        break;
      case 1:
        console.log("rainbow");
        break;
      case 2:
        console.log("train");
        break;
      default:
        console.log("no answer");

    }
  });
  // for (let i = 1; i < 6; i++){
  // trainEpoch(training);
  // console.log("epoch: "+ i);
  // let percent = testAll(testing);
  // console.log(percent);
  // }
}



function draw(){
  strokeWeight(8);
  stroke(0);
  if(mouseIsPressed){
    line(pmouseX, pmouseY, mouseX, mouseY);
  }

}

function prepareData(category, data, label){
  category.training = [];
  category.testing = [];
  for (let i = 0; i < TOTALDATA; i++){
    let offset = i * LEN;
    let treshold = TOTALDATA*0.8;
    if (i<treshold){
      category.training[i] = data.bytes.subarray(offset, offset + LEN);
      category.training[i].label = label;
    }else{
      category.testing[i - treshold] = data.bytes.subarray(offset, offset + LEN);
      category.testing[i - treshold].label = label;
    }
  }
}

function trainEpoch(training){
  // Train it for one epoch
  for( let j = 0; j < 1000; j++){
    for (let i = 0; i < training.length; i++){
      let data = training[i];
      let inputs = Array.from(data).map(x => x/255);
      let label = training[i].label;
      let targets = [0, 0, 0];
      targets[label] = 1;
      nn.train(inputs, targets);
    }
    console.log("train for one epoch");
  }
}

function testAll(testing){
  let correct = 0;
  for (let i = 0; i < testing.length; i++){
    let data = testing[i];
    let inputs = Array.from(data).map(x => x/255);
    let label = testing[i].label;
    let guess = nn.predict(inputs);
    let m = max(guess);
    let classification = guess.indexOf(m)
    // console.log(classification, label);

    if(classification === label){
      correct++;
    }

  }

  let percent = 100 * correct / testing.length;
  return percent
}

function clearCanvas(){
  background(255);
}
