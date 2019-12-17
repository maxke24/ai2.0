const trainX = tf.tensor2d([[0, 0], [0,1], [1, 0], [1, 1]]);
const trainY = tf.tensor2d([[0],[1],[1],[0]]);

let x

let model;

let resolution = 20;
let cols;
let rows;
let xs;

function setup() {
  createCanvas(400, 400);

  cols = width / resolution;
  rows = height / resolution;

  let inputs = []
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = i / cols;
      let x2 = j / rows;
      inputs.push([x1, x2]);
    }
  }

  xs = tf.tensor2d(inputs);

  model = tf.sequential();

  let hiddenConfig = {
    inputShape: [2],
    units: 4,
    activation: "sigmoid"
  };
  let hidden = tf.layers.dense(hiddenConfig);

  let outputConfig = {
    units: 1,
    activation: "sigmoid"
  };
  let output = tf.layers.dense(outputConfig);

  model.add(hidden);
  model.add(output);

  const optimizer = tf.train.adam(0.1);
  model.compile({
    optimizer: optimizer,
    loss: "meanSquaredError"
  });
setTimeout(train, 100);
}

function trainModel(){
  return model.fit(trainX, trainY, {
    shuffle: true,
    epochs: 10
  });
}


function draw() {
  background(0);

  tf.tidy(() => {
  // Get the predictions
  let y = model.predict(xs).dataSync();

  // Draw the ouputs
  let index = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      stroke(255);
      let br = y[index] * 255;
      fill(br);
      rect(i * resolution, j * resolution, resolution, resolution);
      fill(255 - br);
      noStroke();
      textSize(8);
      textAlign(CENTER, CENTER);
      text(nf(y[index], 1, 2), i*resolution + resolution / 2, j*resolution + resolution / 2)
      index++;
    }
  }
  });
  // noLoop();
}

function train(){
  trainModel().then(result => {
    console.log(result.history.loss[0]);
    console.log(tf.memory().numTensors);
    setTimeout(train, 100);
  });
}
