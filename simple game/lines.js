class Line{
  constructor(x, y, x1, y1){
    this.cor1 = createVector(x, y);
    this.cor2 = createVector(x1, y1);
    line(this.cor1.x, this.cor1.y, this.cor2.x, this.cor2.y);
  }

}
