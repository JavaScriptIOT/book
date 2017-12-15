var fs = require("fs");
fs.open("server.log", 'r', function(err, fd){
    if (err) throw err;
    var length = 100;
    var position = 0;
    var buffer = new Buffer(length);
    fs.read(fd, buffer, 0, length, position, function(err, bytes, data) {
        if (err) throw err;
        console.log({
            log: data.toString(),
            length: bytes
        });
    })
})
