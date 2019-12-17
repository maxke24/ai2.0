let x_vals = [];
let y_vals = [];

let m, b;

const learningRate = 0.3;
const optimizer = tf.train.sgd(learningRate);

function setup(){
    createCanvas(400, 400);

    m = tf.variable(tf.scalar(random(1)));
    b = tf.variable(tf.scalar(random(1)));

}

function draw(){
    tf.tidy(()=>{
        if (x_vals.length > 0){
            const ys = tf.tensor1d(y_vals);
            optimizer.minimize(() => loss(predict(x_vals), ys));
        }
    });
    background(0);
    stroke(255);
    strokeWeight(6);
    for(let i = 0; i < x_vals.length; i++){
        let px = map(x_vals[i], 0, 1, 0, width);
        let py = map(y_vals[i], 1, 0, 0, height);
        point(px, py);

    }

    let x = [0, 1];
    let yPoints;
    tf.tidy(()=>{
        let y = predict(x);
        yPoints = y.dataSync();
    });


    let x1 = map(x[0], 0, 1, 0, width);
    let x2 = map(x[1], 0, 1, 0, width);
    let y1 = map(yPoints[0], 0, 1, height, 0);
    let y2 = map(yPoints[1], 0, 1, height, 0);
    strokeWeight(2);
    line(x1, y1, x2, y2);

    console.log(tf.memory().numTensors);
}

function mousePressed(){
    let x = map(mouseX, 0, width, 0, 1);
    let y = map(mouseY, 0, height, 1, 0);
    x_vals.push(x);
    y_vals.push(y);
}

function predict(x){
    const xs = tf.tensor1d(x);
    const ys = xs.mul(m).add(b); // y = mx + b
    return ys;
}

function loss(pred, labels){
    return pred.sub(labels).square().mean();
}