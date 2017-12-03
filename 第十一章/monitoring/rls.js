var math = require('mathjs');
function finitQueue(size) {
    this.size = size;
    this.queue = [];
}

finitQueue.prototype.push = function(e) {
    if (this.queue.length < this.size) {
        this.queue.push(e);
        return null;
    } else {
        this.queue.push(e);
        return this.queue.shift();
    }
} 

var q = new finitQueue(2)
q.push(1)
q.push(2)
q.push(3)
q.push(4)
console.log(q.queue)

// https://en.wikipedia.org/wiki/Recursive_least_squares_filter

var a = math.matrix([1, 4, 9, 16, 25]);

function rls(size) {
    this.size = size;
    this.queue = finitQueue(size);
    this.weight = new Array(size);
}

rls.prototype.enqueue = function (input) {
    this.queue.push(input);
}