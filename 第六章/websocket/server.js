var sys = require('sys');
var net = require('net');
var mqtt = require('mqtt');
var io = require('socket.io').listen(5000); 
var client = mqtt.connect('mqtt://test.mosquitto.org')
io.sockets.on('connection',  function (socket) { 
      socket.on('subscribe',  function (data) {   
            console.log('Subscribing to ' + data.topic);
            client.subscribe(data.topic);
        client.publish(data.topic, "27.0")
      });
});

client.on('message', function (topic, message) { 
      sys.puts(topic + '=' + message);
      io.sockets.emit('mqtt', {
        'topic': String(topic),
          'payload': String(message)
    }); 
})

var port = 8080
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");
http.createServer(function (req, res) {
    var pathname = __dirname + url.parse(req.url).pathname;
    // response of web request
    if (path.extname(pathname) == "") {
        pathname += "/";
    }
    if (pathname.charAt(pathname.length - 1) == "/") {
        pathname += "index.html";
    }
    fs.exists(pathname, function (exists) {
        if (exists) {
            switch (path.extname(pathname)) {
                case ".html":
                    res.writeHead(200, {
                        "Content-Type": "text/html"
                    });
                    break;
                default:
                    res.writeHead(200, {
                        "Content-Type": "application/octet-stream"
                    });
            }
            fs.readFile(pathname, function (err, data) {
                res.end(data);
            });
        } else {
            res.writeHead(404, {
                "Content-Type": "text/html"
            });
            res.end("<h1>404 Not Found</h1>");
        }
    });
}).listen(port);

console.log("Server running at port " + port);