var microtime = require('microtime')
var t1 = microtime.now()
// 用户程序逻辑
var delay = microtime.now() - t1 //获得时延测量值