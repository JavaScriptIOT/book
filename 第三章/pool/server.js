var Pool = require('generic-pool').Pool;
var mysql = require('mysql'); // v2.10.x
var pool = new Pool({
    name     : 'mysql',
    create   : function(callback) {
        var c = mysql.createConnection({
                user: 'root',
                password: 'lab123',
                database:'iotdb'
        })

        // parameter order: err, resource
        callback(null, c);
    },
    destroy  : function(client) { client.end(); },
    max      : 10,
    min      : 2,
    idleTimeoutMillis : 30000,
    log : true
});

pool.acquire(function(err, client) {
    if (err) {
        // 错误处理
    }
    else {
        client.query("select * from foo", [], function() {
            // 将对象返还到连接池
            pool.release(client);
        });
    }
});

pool.drain(function() {
    pool.destroyAllNow();
});