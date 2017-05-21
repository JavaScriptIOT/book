    var iptables = require('iptables');

    iptables.allow({
        protocol : 'tcp',
        src : '192.168.1.5',
        dport : 12345,
        sudo : false
    });

    iptables.drop({
        protocol : 'tcp',
        dport : 54321,
        sudo : false
    });

