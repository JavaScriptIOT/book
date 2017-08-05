var ml = require('machine_learning');
var x = [[0.5],[0.75],[1.0],[1.25],[1.5],[1.75],[2.0],[2.25],[2.5],[2.75],[3.0],[3.25],[3.25],[3.5],[4.0],[4.25],[4.5],[4.75],[5.0],[5.5]];
var y = [[0, 1],[0, 1],[0, 1],[0,1],[0,1],[1,0],[0,1],[1,0],[0,1],[1,0],[0,1],[1,0],[0,1],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0],[1,0]];

var classifier = new ml.LogisticRegression({
    'input' : x,
    'label' : y,
    'n_in' : 1,
    'n_out' : 2
});

classifier.set('log level',1);

var training_epochs = 800, lr = 0.01;

classifier.train({
    'lr' : lr,
    'epochs' : training_epochs
});

x = [[0.7],[4.4]];

console.log("Result : ",classifier.predict(x));
