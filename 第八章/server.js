var http = require('http');
var express = require('express');
var app = express();            
var loadDir = require('./loaddir');    
var module = loadDir(config.app_path);    

app.set("etag", false);           
app.use(bodyParser.urlencoded({ 
    extended: true
}));
app.use(bodyParser.json()); 
app.use(bodyParser.text()); 
app.use(bodyParser.raw()); 
app.use(express.static(__dirname + '/page'));
app.use(multer({
    dest: './uploads/'
}));
var server = http.createServer(app);
server.listen(port);
