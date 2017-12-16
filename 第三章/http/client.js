var http = require("http")
http.get("http://localhost:8080/echo", function (res) {
    var body = '';
    res.on('data', function (data) {                       
        body += data;
    });
    res.on('end', function () {                            
        console.log(JSON.parse(body))
    })
})
