var net = require('net');
var client = net.connect({port: 8124},     //监听8124端口上的TCP连接
    function() {                                // 连接相应回调函数
  console.log('connected to server!');     
  client.write('Hello world!\r\n');         // 向对端发送欢迎信息
});
client.on('data', function(data) {          // 当接受到对端的数据时的响应
  console.log(data.toString());
  client.end();
});
client.on('end', function() {                 // 当对端关闭TCP连接时的响应
  console.log('disconnected from server');
});
