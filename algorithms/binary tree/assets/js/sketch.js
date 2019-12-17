let tree;
let node;
let i;
let w;

function setup(){
	createCanvas(600, 400);
	background(51);
	tree = new Tree();
	for (i = 0; i < 50; i++) {
		let n = floor(random(0, 1000));
		w = (width)/(i+1);
		console.log(n, w);
		tree.addValue(n);
	}
	tree.traverse();
}