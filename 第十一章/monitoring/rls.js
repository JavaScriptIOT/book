var math = require('mathjs');
function FinitQueue(size) {
    this.size = size;
    this.queue = [];
}

FinitQueue.prototype.push = function(e) {
    if (this.queue.length < this.size) {
        this.queue.push(e);
        return null;
    } else {
        this.queue.push(e);
        return this.queue.shift();
    }
} 

// Algorithm reference
// https://en.wikipedia.org/wiki/Recursive_least_squares_filter
function RLS(size, lamda, delta) {
    this.size = size;
    this.lamda = lamda;
    this.delta = delta;
    this.w = new Array(size);
    this.P = math.multiply(math.eye(size), 1.0 / delta);
}

RLS.prototype.init = function (w0, P0) {
    this.w = w0;
    this.P = P0;
}

RLS.prototype.update = function (x, d) {
    var alpha = d -  math.multiply((math.transpose(x),this.w));
    var g = math.multiply(math.multiply(this.P, x), 1 / (lamda +  math.multiply(math.multiply((math.transpose(x),this.P)), x)));
    this.P = math.multiply(math.subtract(this.P, math.multiply(math.multiply((g, math.transpose(x))),this.P)),1/lamda); 
    this.w = math.add(w,math.multiply(alpha,g)); 
    return alpha;
}

RLS.prototype.estimate = function (x) {
    return math.multiply(math.transpose(this.w),x);
}

function AnormalDetection(size, lamda, delta, threshold) {
    this.queue = new FinitQueue(size);
    this.rls   = new RLS(size,lamda,delta);
    this.threshold = threshold;
}

AnormalDetection.prototype.detection = function (input) {
    var x =   math.math.matrix(this.queue.queue);
    var out = this.queue.push(input);
    if(out != null) {
        est = this.rls.estimate(x)
        var error = this.rls.update(x, input);
        if (math.abs(error) > this.threshold) console.log("Anormal found")
    }
}


// var q = new finitQueue(2)
// q.push(1)
// q.push(2)
// q.push(3)
// q.push(4)
// console.log(q.queue)