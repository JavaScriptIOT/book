var cluster = require('cluster');
var net = require('net');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  // Workers can share any TCP connection
  var server = net.createServer(function(c) { //'connection' listener
    console.log('client connected');
    c.on('end', function() {
    console.log('client disconnected');
    });
    c.write('hello\r\n');
    c.pipe(c);
  });
  server.listen(8124, function() { //'listening' listener
  console.log('server bound');
  });
}
