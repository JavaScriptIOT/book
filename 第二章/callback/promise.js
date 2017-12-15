var promise = require("bluebird");
var fs = promise.promisifyAll(require('fs'), {
  filter: function (name) {
    return !(name === "read" || name === "write");
  },
});
fs.readAsync = promise.promisify(fs.read, { multiArgs: true });
fs.writeAsnyc = promise.promisify(fs.write, { multiArgs: true });

fs.openAsync("server.log", 'r')
  .then(function (fd) {
    var length = 100;
    var position = 0;
    var buffer = new Buffer(length);
    return fs.readAsync(fd, buffer, 0, length, position)
  }).spread(function (bytes, data) {
    console.log({
      log: data.toString(),
      length: bytes
    });
  }).catch(function (error) {
    console.log({
      error: error
    });
  })
