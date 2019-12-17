let data;
let model;
let xs, ys;
let lossP;
let labelP;
let rSlider, gSlider, bSlider;
let labelList = [
  'red-ish',
  'green-ish',
  'blue-ish',
  'orange-ish',
  'yellow-ish',
  'pink-ish',
  'purple-ish',
  'brown-ish',
  'grey-ish'
];

function preload(){
  data = loadJSON('assets/data/colorData.json');
}

function setup(){
  labelP = createP("label");
  lossP = createP("loss");
  rSlider = createSlider(0, 255, 255);
  gSlider = createSlider(0, 255, 255);
  bSlider = createSlider(0, 255, 0);

  let colors = [];
  let labels = [];
  for (let record of data.entries) {
    let col = [record.r/255, record.g/255, record.b/255];
    colors.push(col);
    labels.push(labelList.indexOf(record.label));
  }

  xs = tf.tensor2d(colors);
  let labelsTensor = tf.tensor1d(labels, 'int32');
  ys = tf.oneHot(labelsTensor, 9);
  labelsTensor.dispose();

  model = tf.sequential();

  let hidden = tf.layers.dense({
    units: 32,
    activation: "sigmoid",
    inputDim: 3
  });

  let output = tf.layers.dense({
    units: 9,
    activation: "softmax"
  });

  model.add(hidden);
  model.add(output);

  let lr = 0.5;
  let optimizer = tf.train.adam(lr);
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy'
  });
  train().then(result => {
    console.log(result.history.loss)
  });
}

async function train(){
  let options = {
    epochs: 10,
    validationSplit: 0.1,
    shuffle: true,
    callbacks: {
      // onTrainBegin: () => console.log("training start"),
      // onTrainEnd: () => console.log("training complete"),
      onBatchEnd:  tf.nextFrame,
      onEpochEnd: (num, logs) => {
        console.log(`epoch: ${num}`);
        lossP.html(`loss: ${logs.val_loss}`);
      }
    }
  }
  
  return await model.fit(xs, ys, options);
}

function draw(){
  let r = rSlider.value();
  let g = gSlider.value();
  let b = bSlider.value();
  background(r, g, b);
  const xs = tf.tensor2d([
    [r/255, g/255, b/255]
  ]);
  tf.tidy(() => {
  let results = model.predict(xs);
  let index = results.argMax(1).dataSync();
  let label = labelList[index];
  labelP.html(label);
});
}
