var alert = require('node-alert')({
  plugins : {
    mail : {
      nodemailer : {
        port : 25,
        host : "smtp.myserver.com",
        auth : {
          user : "myname@myserver.com",
          pass : "mypass"
      },
      message   : {
        addressed_to : "node-alert maintainer",
        serviceName : "Node-Alert test"
      }
    } 
  }
});
var cron = require('cron').CronJob;
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});

new cron('* * * * * *', function() {
client.search({
  index: 'myindex',     
  body: {
    query: {
      match: {                  
        title: 'test'          
      }
    }
 }
}, function (error, response) {
	alert.alertMail(new Error('Test Error'), function(err, info) {
	  if (err) console.log(err);
	  else console.log('Success!');
	});
});

	 
}, null, true, 'America/Los_Angeles');


