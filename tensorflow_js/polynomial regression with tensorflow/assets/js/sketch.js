let x_vals = [];
let y_vals = [];

let a, b, c, d;

const learningRate = 0.1;
const optimizer = tf.train.adam(learningRate);

function setup(){
    createCanvas(400, 400);

    a = tf.variable(tf.scalar(random(-1, 1)));
    b = tf.variable(tf.scalar(random(-1, 1)));
    c = tf.variable(tf.scalar(random(-1, 1)));
    d = tf.variable(tf.scalar(random(-1, 1)));
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
        let px = map(x_vals[i], -1, 1, 0, width);
        let py = map(y_vals[i], 1, -1, 0, height);
        point(px, py);

    }

    let curve = [];
    for (let x = -1; x < 1.01; x += 0.05){
        curve.push(x);
    }
    let yPoints;
    tf.tidy(()=>{
        let y = predict(curve);
        yPoints = y.dataSync();
    });
    stroke(255);
    beginShape();
    noFill();
    strokeWeight(2);
    for(let i = 0; i < curve.length; i++){
        let x = map(curve[i], -1, 1, 0, width);
        let y = map(yPoints[i], -1, 1, height, 0);
        vertex(x,y);
    }
    endShape();

    console.log(tf.memory().numTensors);
}

function mousePressed(){
    let x = map(mouseX, 0, width, -1, 1);
    let y = map(mouseY, 0, height, 1, -1);
    x_vals.push(x);
    y_vals.push(y);
}

function predict(x){
    const xs = tf.tensor1d(x);
    const ys = xs.pow(tf.scalar(3)).mul(a)
              .add(xs.square().mul(b))
              .add(xs.add(c))
              .add(d); // y = ax² + bx +c
    return ys;
}

function loss(pred, labels){
    return pred.sub(labels).square().mean();
}
