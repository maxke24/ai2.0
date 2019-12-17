let video;
let poseNet;
let pose;
let skeleton;

let brain;

let state = "waiting";
let poseLabel = "label";

// function keyPressed(){
//   if (key === 's'){
//     brain.saveData();
//   }{
//     targetLabel = key;
//     console.log(targetLabel);
//     setTimeout(function(){
//       state = "collecting";
//       setTimeout(function(){
//         state = "waiting";
//       }, 5000)
//     }, 10000)
//   }
// }
function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  background(51);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
  let options = {
    inputs: 34,
    outputs: 4,
    task: "classification",
    debug: true
  }
  brain = ml5.neuralNetwork(options);
  // brain.loadData('data.json', dataReady);
  const modelInfo = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights = "model/model.weights.json"
  }
  brain.load(modelInfo, brainLoaded);

}

function brainLoaded(){
  console.log("model ready");

  brain.classify(inputs, results);
}

function classifyPose(){
  if (pose){
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
      
    }
    brain.classify(inputs, gotResults);
  }else{
    setTimeout(classifyPose, 100);
  }
}

function gotResults(error, results){
  poseLabel = results[0].label;
  console.log(results[0].label);
  classifyPose();
}

function dataReady() {
  brain.normalizeData();
  brain.train({epochs: 10}, finished);
}

function finished() {
  console.log("model trained");
  brain.save();
}

function gotPoses(poses){
  // if (poses.length > 0){
  //   pose = poses[0].pose;
  //   skeleton = poses[0].skeleton;
  //   let inputs;
  //   for (let i = 0; i < pose.keypoints.length; i++) {
  //     let x = pose.keypoints[i].position.x;
  //     let y = pose.keypoints[i].position.y;
  //     inputs.push(x);
  //     inputs.push(y);
  //     ellipse(x, y, 16);
  //   }
  //   let target = [targetLabel];
  //   if(state === "collecting"){
  //     console.log("collecting");
  //     // brain.addData(inputs, target);
  //   }
  // }
}

function modelLoaded(){
  console.log("poseNet loaded");
}


function draw() {
  // translate(video.width, 0);
  // scale(-1, 1);
  // image(video, 0, 0, video.width, video.height);
  // if(pose){
  //   for (let i = 0; i < pose.keypoints.length; i++) {
  //     let x = pose.keypoints[i].position.x;
  //     let y = pose.keypoints[i].position.y;
  //     fill(0, 255, 0);
  //     ellipse(x, y, 16);
  //   }
  //
  //   for (let i = 0; i < skeleton.length; i++){
  //     let a = skeleton[i][0];
  //     let b = skeleton[i][1];
  //     strokeWeight(4);
  //     stroke(255);
  //     line(a.position.x, a.position.y, b.position.x, b.position.y);
  //   }
  //
  // }
fill(0, 255, 0);
noStroke();
textSize(256);
textAlign(CENTER, CENTER);
text(poseLabel, width/2, height/2);

}
