function setup(){
    noCanvas();
    const values = [];
    for (let i = 0; i < 15; i++){
        values[i] = random(0, 100);
    }
    //const shapeA = [5, 3];
    //const shapeB = [3, 5];
    const shape = [5, 3];

    const a = tf.tensor2d(values, shape, 'int32');
    const b = tf.tensor2d(values, shape, 'int32');
    const bT = b.transpose();
    //const c = a.add(b); // == b.add(a)
    const c = a.matMul(bT);
    //a.print();
    //b.print();
    c.print();

    //const vtense = tf.variable(tens);
    //const data = tf.tensor([0, 0, 127.5, 255, 100, 50, 24, 54], [2, 2, 2], 'int32');
    //data.print();
    /*tens.data().then(function (stuff) {
        console.log(stuff);
    });*/
    //console.log(data);

    //console.log(tens.dataSync());
    //console.log(vtense);
}