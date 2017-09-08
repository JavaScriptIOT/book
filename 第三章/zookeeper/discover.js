var zookeeper = require('node-zookeeper-client');
var client = zookeeper.createClient('localhost:2181');
var path = '/';
function listChildren(client, path) {             //从根目录开始发现所有服务

    client.getChildren(
        path,
        function (event) {
            console.log('Got watcher event: %s', event);
            listChildren(client, path);             //递归遍历所有子节点完成服务发现
        },
        function (error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of node: %s due to: %s.',
                    path,
                    error
                );
                return;
            }
            console.log('Children of node: %s are: %j.', path, children);
        }
    );
}
client.once('connected', function () {      //当连接上Zookeeper后，开始服务发现
    console.log('Connected to ZooKeeper.');
    listChildren(client, path);
});
client.connect();                               //尝试连接
