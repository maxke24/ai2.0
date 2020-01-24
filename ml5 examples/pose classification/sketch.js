let video;
let poseNet;
let pose;

function setup() {
  createCanvas(400, 400);
  video = createCapture(video);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
}

function modelLoaded() {
  console.log("model loaded");
}

function gotPoses(poses) {
  if(poses.length > 0) {
    pose = poses[0].pose;
  }
}

function draw(){
  image(video, 0, 0);
  if (pose){
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0)
      ellipse(x, y, 16, 16);
    }
  }
}
