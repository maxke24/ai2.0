let training_data = [
  {
    inputs: [0, 0],
    targets:[0]
  },{
    inputs: [0, 1],
    targets:[1]
  },{
    inputs: [1, 0],
    targets:[1]
  },{
    inputs: [1, 1],
    targets:[0]
  }
];

let nn;
let train;

function setup() {
  createCanvas(innerWidth, innerHeight);
  nn = new NeuralNetwork(2, 4, 1);
  frameRate(30);
  train = false;
  let trainButton = document.querySelector("#train");
  let predictButton = document.querySelector("#predict");
  let guessButton = document.querySelector("#guess");
  let epochCounter = 1;
  trainButton.addEventListener("click", function(){
    if (train){
      this.innerHTML = "Start training!";
      train = false;
      console.log(`Epoch: ${epochCounter}`);
      epochCounter++;
    }else{
      this.innerHTML = "Stop training!";
      train = true;
    }
  });

  predictButton.addEventListener("click", function(){
    let percent;
    percent = testAll();
    console.log(`Percent: ${nf(percent, 2, 2)} %`);
  });

  guessButton.addEventListener("click", function(){
    let input_field = document.querySelector("input ");
    let inputs = input_field.value.split(",").map(Number);
    let guess = nn.predict(inputs);
    let m = max(guess);
    let classification;
    if (m > 0.5){
      classification = 1;
    }else{
      classification = 0;
    }
    console.log(classification);
  });
    //noLoop();
}

function draw(){
    if (train){
        background(51);
        for(let i = 0; i < 2; i++){
            let data = random(training_data);
            nn.train(data.inputs, data.targets);
        }
    }
}

function testAll(){
  let testing = training_data;
  let correct = 0;
  for (let i = 0; i < 1000; i++){
    let data = random(testing);
    let inputs = data.inputs;
    let label = data.targets[0];
    let guess = nn.predict(inputs);
    let m = max(guess);
    let classification;
    if (m > 0.5){
      classification = 1;
    }else{
      classification = 0;
    }

    if(classification === label){
      correct++;
    }

  }

  let percent = 100 * correct / 1000;
  return percent
}
