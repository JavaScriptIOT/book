var zookeeper = require('node-zookeeper-client');
var client = zookeeper.createClient('localhost:2181');
var root = '/serviceA/';
var path = '/serviceA/instance';
client.once('connected', function () {
    console.log('Connected to the server.');
    client.create('/serviceA', function (error) {});
    client.create(path, zookeeper.CreateMode.EPHEMERAL_SEQUENTIAL,function (error) {
        if (error) {
            console.log('Failed to create node: %s due to: %s.', path, error);
        } else {
            console.log('Node: %s is successfully created.', path);
        }
        //client.close();
    });
});
client.connect();
