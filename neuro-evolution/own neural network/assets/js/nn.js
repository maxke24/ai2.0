function sigmoid(x){
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y){
  return y * (1 - y );
}

class NeuralNetwork{
  // TOD: find replacement a, b, c
  constructor(a, b, c) {
    if(a instanceof NeuralNetwork){
      this.input_nodes = a.input_nodes;
      this.hidden_nodes = a.hidden_nodes;
      this.output_nodes = a.output_nodes;

      this.weights_ih = a.weights_ih.copy();
      this.weights_ho = a.weights_ho.copy();

      this.bias_h = a.bias_h.copy();
      this.bias_o = a.bias_o.copy();

      this.learning_rate = a.learning_rate;

    }else{
      this.input_nodes = a;
      this.hidden_nodes = b;
      this.output_nodes = c;

      this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
      this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
      this.weights_ih.randomize();
      this.weights_ho.randomize();

      this.bias_h = new Matrix(this.hidden_nodes, 1);
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_h.randomize();
      this.bias_o.randomize();

      this.learning_rate = 0.1;
    }
  }

  predict(input_array){

    // Generating hidden outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);

    // Activation function
    hidden.map(sigmoid);

    // Generating the output
    let output = Matrix.multiply(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(sigmoid);
    output = output.toArray();
    // Sending back to the caller
    return output;
  }

  train(input_array, target_array){
    // Generating hidden outputs
    let inputs = input_array;
    let outputs = Matrix.fromArray(this.predict(inputs));

    inputs = Matrix.fromArray(inputs);
    let hidden = Matrix.multiply(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    // Activation function

    hidden.map(sigmoid);
    // Generating the output
    //this.visualize(input_array, outputs.toArray());

    // Convert array to matrix object
    let targets = Matrix.fromArray(target_array);

    // Calculate the error
    // ERROR = TARGETS - outputs
    let output_errors = Matrix.subtract(targets, outputs);

    //let gradient = outputs * (1 - outputs);
    // Calculate gradient
    let gradients = Matrix.map(outputs, dsigmoid);
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_rate);

    // Calculate deltas
    let hidden_T = Matrix.transpose(hidden);
    let weights_ho_deltas = Matrix.multiply(gradients, hidden_T);

    // Adjust weights and bias by deltas
    this.weights_ho.add(weights_ho_deltas);
    this.bias_o.add(gradients);
    // Calculate the hidden layer errors
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden_errors = Matrix.multiply(who_t, output_errors);

    // Calculate hidden gradient
    let hidden_gradients = Matrix.map(hidden, dsigmoid);
    hidden_gradients.multiply(hidden_errors);
    hidden_gradients.multiply(this.learning_rate);

    // Calculate input to hidden weights_ho_deltas
    let inputs_T = Matrix.transpose(inputs);
    let weights_ih_deltas = Matrix.multiply(hidden_gradients, inputs_T);

    // Adjust hidden weights and hidden bias by deltas
    this.weights_ih.add(weights_ih_deltas);
    this.bias_h.add(hidden_gradients);
  }

  // functions for neuro-evolutions
  copy(){
    return new NeuralNetwork(this);
  }

  mutate(rate){
  function mutate(val){
      if (Math.random() < rate) {
        return val + randomGaussian(0, 0.1);
      // return Math.random() * 2 - 1;
    }else{
      return val;
    }
  }
  this.weights_ih.map(mutate);
  this.weights_ho.map(mutate);
  this.bias_h.map(mutate);
  this.bias_o.map(mutate);
  }

  // saving a neural network when trained
  serialize() {
  return JSON.stringify(this);
}

static deserialize(data) {
  if (typeof data == 'string') {
    data = JSON.parse(data);
  }
  let nn = new NeuralNetwork(data.input_nodes, data.hidden_nodes, data.output_nodes);
  nn.weights_ih = Matrix.deserialize(data.weights_ih);
  nn.weights_ho = Matrix.deserialize(data.weights_ho);
  nn.bias_h = Matrix.deserialize(data.bias_h);
  nn.bias_o = Matrix.deserialize(data.bias_o);
  nn.learning_rate = data.learning_rate;
  return nn;
}

}
