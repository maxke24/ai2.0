
class Ball {
  constructor(x, y) {
    this.r = 16;
    this.x = x;
    this.y = y;
    this.color = 255;
}
  display() {
    if (this.collision){
      this.color = 0;
    }else{
      this.color = 255;
    }
    fill(this.color);
    ellipse(this.x, this.y, this.r, this.r);
  }
}
