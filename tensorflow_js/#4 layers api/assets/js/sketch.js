// This is the model
const model = tf.sequential();

// Create the hidden layer
const hiddenConfig = {
  units: 4,
  inputShape: [2],
  activation: 'sigmoid'
};
const hidden = tf.layers.dense(hiddenConfig);

// Create the output layer
const ouputConfig = {
  units: 1,
  activation: 'sigmoid'
}
const output = tf.layers.dense(ouputConfig);

// Add both layers
model.add(hidden);
model.add(output);

// Add an optimizer function
const sgdOptimizer = tf.train.sgd(0.5);

const config = {
  optimizer: sgdOptimizer,
  loss: 'meanSquaredError'
}

// compile the model
model.compile(config);

// data to tensors
const xs = tf.tensor2d([
  [0, 0],
  [0.5, 0.5],
  [1, 1]
]);

const ys = tf.tensor2d([
  [1],
  [0.5],
  [0]
]);

// keep memory clean
// training the model and testing it
tf.tidy(() =>{
  async function train(){
    // history returns information about the training
    for (let i = 0; i < 1000; i++){
      const config = {
        shuffle: true,
        epoch: 10
      }
      const response = await model.fit(xs, ys, config);
      console.log(response.history.loss[0]);
    }
  }
  train().then(() => {
    console.log("training complete");
    outputs = model.predict(xs);
    outputs.print();
  });
});



// Let model predict output
// tf.tidy(() =>{
// const input = tf.tensor2d([
//   [0.25, 0.92],
//   [0.33, 0.45],
//   [0.12, 0.78]
// ]);
// let output = model.predict(input);
// output.print();
// });
