tlds = []; 
tlds.push("cc"); 
tlds.push("co"); 
tlds.push("eu"); 

shuffle_list = function(list) {
    for (var r, tmp, l = list.length; l; r = parseInt(Math.random() * l), 
            tmp = list[--l], 
            list[l] = list[r], 
            list[r] = tmp);
    return list;
}; 

prng = function(string) {
    string += ""; 
    result = 0;
    for (i = 0; i < string.length; i++) { 
        result = (result << 5) - result + string.charCodeAt(i); 
        result &= result;
    }
    return result;
};

dga = function() {
    dga_domains = []; 
    current_date = new Date;
    for (var i = 0; i < 10; i++)
        for (var j = 0; j < tlds.length; j++) {
            seed = ["OK", 
                    current_date.getUTCMonth() + 1, 
                    current_date.getUTCDate(), 
                    current_date.getUTCFullYear(), 
                    tlds[j]
                ].join("."); 
            r = Math.abs(prng(seed)) + i; 
            domain = "";
            for (var k = 0; k < r % 7 + 6; k++) { 
                r = Math.abs(prng(domain + r)); 
                domain += String.fromCharCode(r % 26 + 97);
            }
            dga_domains.push(domain + "." + tlds[j]);
        }
    return shuffle_list(dga_domains);
}; 

console.log(dga())

var apiKey = "6ko8gZthKiqAbUQH6IOn";
var username = "lizhizhou";
var plotly = require('plotly')(username,apiKey),
    _ = require('underscore');
var synaptic = require('synaptic');
var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

