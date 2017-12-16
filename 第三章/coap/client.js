var coap  = require('coap') 
var req   = coap.request('coap://localhost/iot')//设置请求变量
//请求发出，并监听响应，
req.on('response', function(res) {
    //将响应结果输出
      res.pipe(process.stdout)
})
req.end()
