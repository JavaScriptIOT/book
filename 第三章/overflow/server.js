// server.js
function cleanCache (module) {
    var path = require.resolve(module);
    require.cache[path] = null;}
setInterval(function () {
    var code = require('./app.js');
    cleanCache('./app.js');}, 10);