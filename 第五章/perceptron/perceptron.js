var synaptic = require('synaptic'); 
var Neuron = synaptic.Neuron;
var A = new Neuron();             
A.squash = Neuron.squash.TANH; 
A.bias = 1;                       