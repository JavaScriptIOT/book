var coap    = require('coap')       //加载coap模块
var server  = coap.createServer() //创建coap服务
//服务器监听到request后执行的函数，
server.on('request', function(req, res) { // 可以看到和前面的RESTFul协议类似，也是处理请求与响应，
  res.end('Hello ' + req.url.split('/')[1] + '\n')
})   
server.listen(function() {
  console.log('server started') //服务器启动后执行的函数
})

