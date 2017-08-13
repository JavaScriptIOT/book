var deeplearn = require("deeplearn")
var g = new deeplearn.Graph();

// Placeholders are input containers. This is the container for where we will
// feed an input NDArray when we execute the graph.
var a = g.placeholder('input', [3]);

// Variables are containers that hold a value that can be updated from training.
// Here we initialize the multiplier variable randomly.
var w = g.variable('multiplier', deeplearn.Array2D.randNormal([1, 3]));

var b = g.variable('bais', deeplearn.Array1D.randNormal([1]));

// Top level graph methods take Tensors and return Tensors.
var t = g.add(g.matmul(w, a),b);

// Tensors, like NDArrays, have a shape attribute.
console.log(t.shape);
