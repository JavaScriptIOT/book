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