// server.js 基础代码
var express = require('express');
var fs = require('fs');
var app = express();
var router = require('./app.js');
var port = 8080;
app.use(function (req, res, next) {
    router(req, res, next);});
app.listen(port);
console.log("Server at port " + port); 
fs.watch(require.resolve('./app.js'), function () {
    cleanCache(require.resolve('./app.js'));
    try {
        router = require('./app.js');
    } catch (ex) {
        console.error('module update failed');
    }});
function cleanCache(modulePath) {
    delete require.cache[modulePath];         
}