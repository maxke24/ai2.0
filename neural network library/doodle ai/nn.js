function sigmoid(x){
  return 1 / (1 + Math.exp(-x));
}

function dsigmoid(y){
  return y * (1 - y );
}

class NeuralNetwork{
  constructor(input_nodes, hidden_nodes, output_nodes) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    let i = 0;
    this.output_nodes = output_nodes;

    this.weights_ih = new Matrix(this.hidden_nodes, this.input_nodes);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes);
    this.weights_ih.randomize();
    this.weights_ho.randomize();

    this.bias_h = new Matrix(this.hidden_nodes, 1);
    this.bias_o = new Matrix(this.output_nodes, 1);
    this.bias_h.randomize();
    this.bias_o.randomize();
    this.max_weight = 0;
    this.min_weight = 0;

    this.learning_rate = 0.1;
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

  visualize(inputs, outputs) {

    let maxNodes = Math.max(this.input_nodes, this.hidden_nodes, this.output_nodes);
    let middle = (maxNodes*45)/1.28;
    let minmax = this.find_minmax();
    let ySpacing = 75;
    let x = 50;
    let j = 100;
    let y = middle - ((30 + j) + (this.input_nodes));

    for(let i = 0; i < this.input_nodes; i++){
      noStroke();
      fill(255);
      let txt = inputs[i];
      textAlign(CENTER, CENTER);
      strokeWeight(2);
      ellipse(x, y+j, 50, 50);
      fill(0);
      text(txt, x, y+j);
      j += ySpacing;
    }
    x += 150;
    y = 0;
    j = 30;
    for(let i = 0; i < this.hidden_nodes; i++){
      fill(255);
      ellipse(x, y+j, 50, 50);
      j += ySpacing;
    }
    x += 150;
    y = middle - 25;
    j = 25;
    for(let i = 0; i < this.output_nodes; i++){
      noStroke();
      fill(255);
      let txt = Math.floor(outputs[i]*100)/100;
      ellipse(x, y+j, 50, 50);
      fill(0);
      text(txt, x, y+j);
      j += 100;
    }
    stroke(0);
    x = 50;
    y = 20;
    let weights = this.weights_ih.data;
    for(let i = 0; i < weights.length; i++) {
      let y1Offset = ySpacing + 12.5;
      let y2Offset = i * ySpacing + 4;
      let weight = weights[i];
      for (let j = 0; j < weight.length; j++) {
        if (weight[j] > 0) {
          let sWeight = map(weight[j], minmax[0], minmax[1], 0.1, 4);
          strokeWeight(sWeight);
          stroke(0, 255, 0);
          line(x+25, y + y1Offset, x + 125, 25 + y2Offset);
        } else {
          let sWeight = map(weight[j], minmax[0], minmax[1], 0.1, 4);
          strokeWeight(sWeight);
          stroke(255, 0, 0);
          line(x+25, y + y1Offset, x + 125, 25 + y2Offset);
        }
        y1Offset += ySpacing;
      }
    }
    x += 150;
    y = 25;
    let yOffset = 0;
    for (let j = 0; j < this.hidden_nodes; j++){
      yOffset = j * ySpacing + 4;
      let weight = this.weights_ho.data[0];
      if (weight[j] > 0) {
        let sWeight = map(weight[j], minmax[0], minmax[1], 0.1, 4);
        strokeWeight(sWeight);
        stroke(0, 255, 0);
        line(x+25, y+yOffset, x+125, middle);
      } else {
        let sWeight = map(weight[j], minmax[0], minmax[1], 0.1, 4);
        strokeWeight(sWeight);
        stroke(255, 0, 0);
        line(x+25, y+yOffset, x+125, middle);
      }
      let txt = `The neural network is for ${percentage}% accurate.`;
      let p = document.querySelector("#percentage");
      p.innerHTML = txt;
    }


  }

  find_minmax(){
    let tempArr = [];
    let returnArr = [];
    for (let i = 0; i < this.weights_ho.data.length; i++){
      let weight = this.weights_ho.data[i];
      let maxW = Math.max.apply(null, weight);
      let minW = Math.min.apply(null, weight);
      tempArr.push(maxW);
      tempArr.push(minW);
    }
    for (let i = 0; i < this.weights_ih.data.length; i++) {
      let weight = this.weights_ih.data[i];
      let maxW = Math.max.apply(null, weight);
      let minW = Math.min.apply(null, weight);
      tempArr.push(maxW);
      tempArr.push(minW);
    }
    let minW = Math.min.apply(null, tempArr);
    let maxW = Math.max.apply(null, tempArr);
    returnArr.push(minW);
    returnArr.push(maxW);
    return returnArr;
  }

}
