    var iptables = require('iptables');

    iptables.allow({
        protocol : 'tcp',
        src : '10.1.1.5',
        dport : 34567,
        sudo : true
    });

    iptables.drop({
        protocol : 'tcp',
        dport : 34567,
        sudo : true
    });

