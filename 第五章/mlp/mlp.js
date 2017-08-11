var synaptic = require('synaptic'); 
var Layer = synaptic.Layer;
var Network = synaptic.Network;
function Perceptron(input, hidden1, hidden2, output)
{

	var inputLayer = new Layer(input);  
	var hiddenLayer1 = new Layer(hidden1);
	var hiddenLayer2 = new Layer(hidden2);
	var outputLayer = new Layer(output);

	inputLayer.project(hiddenLayer1); 
	hiddenLayer1.project(hiddenLayer2);
	hiddenLayer2.project(outputLayer);

	this.set({
		input: inputLayer,
		hidden: [hiddenLayer1,hiddenLayer2],
		output: outputLayer
	});
}

Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron; 

var Trainer= synaptic.Trainer; 
var myPerceptron = new Perceptron(2, 3, 2, 1) 
var trainer = new Trainer(myPerceptron)        
var trainingSet = [                           
  {input: [0,0],output: [0]},
  {input: [0,1],output: [1]},
  {input: [1,0],output: [1]},
  {input: [1,1],output: [0]},
]
trainer.train(trainingSet,{ 
	rate: 0.1,
	iterations: 2000000,
	log: 1000}
);      

console.log(myPerceptron.activate([0,0])); 
console.log(myPerceptron.activate([1,0])); 
console.log(myPerceptron.activate([0,1]));
console.log(myPerceptron.activate([1,1]));       

