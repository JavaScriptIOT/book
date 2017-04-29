var http = require("http"),
    url = require("url"),
    path = require("path")
var port = 8080
http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;
    // response of echo message
    if (path.basename(pathname) == "echo") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({message:"Hello Word"}));
    }
 
}).listen(port);
console.log("Server at port " + port);