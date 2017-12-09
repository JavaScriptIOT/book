
// 5.3.3 递归神经网络物联网电压信号预测
//   Synaptic
// http://caza.la/synaptic/#/dsr
// LSTM 时间序列预测温度
// http://www.infoq.com/cn/news/2016/07/TensorFlow-LSTM
// http://mourafiq.com/2016/05/15/predicting-sequences-using-rnn-in-tensorflow.html


var apiKey = "6ko8gZthKiqAbUQH6IOn";
var username = "lizhizhou";
var plotly = require('plotly')(username,apiKey),
    _ = require('underscore');
var synaptic = require('synaptic');
var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

function linspace(start, step, stop)
{
  var data = [];
  while (start < stop)
  {
    data.push(start)
    start = start + step
  }
  return data;
}

var myNetwork = new Architect.LSTM(1,4,4,4,1)
var trainer = new Trainer(myNetwork)

var x = linspace(0,0.1,2)


var y = x.map(function(x) { return Math.abs(x); }); 


var trainingSet = x.map(function(x) { return {input:[x], output:[Math.sin(x)]}; }); 

// trainingSet.map(console.log)

// var trainingSet = [                               
//   {input: [0],output: [0]},
//   {input: [0.1],output: [0.1]},
//   {input: [0.2],output: [0.2]},
//   {input: [0.3],output: [0.3]},
//   {input: [0.4],output: [0.4]},
//   {input: [0.5],output: [0.5]},
//   {input: [0.6],output: [0.6]},
//   {input: [0.7],output: [0.7]},
// ]

// trainingSet.map(console.log)

trainer.train(trainingSet, {
  iterations: 100000,
  error: .001,
  log: 100,
	cost: Trainer.cost.CROSS_ENTROPY
});

console.log(myNetwork.activate([0.1]))
console.log(myNetwork.activate([0.2]))
console.log(myNetwork.activate([0.3]))
console.log(myNetwork.activate([0.4]))
console.log(myNetwork.activate([0.5]))

var y2 = x.map(function(x) { return myNetwork.activate([x]); }); 

var layout = {
  title: 'Modulation signal',
  xaxis: {
    title: 'Time'
  },
  yaxis: {
    title: 'Voltage'
  }
};
var trace1 = {
  x: x,
  y: y,
  name: 'Training Data',
  mode: "lines",
  type: "scatter"
};
var trace2 = {
  x: x,
  y: y2,
  name: 'LSTM Estimation',
  mode: "lines",
  type: "scatter"
};
var plotData = [trace1, trace2];
// var graphOptions = {layout: layout,filename: "LSTM-Estimation", fileopt: "overwrite"}
// plotly.plot(plotData, graphOptions, function (err, msg) {
//   if (err) {
//     console.log(err);
//     process.exit(3);
//   } else {
//     console.log('Success! The plot (' + msg.filename + ') can be found at ' + msg.url);
//     process.exit();
//   }
// });

