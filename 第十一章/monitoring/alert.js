var alert = require('node-alert')({
  plugins: {
    mail: {
      nodemailer: {
        port: 25,
        host: "smtp.myserver.com",
        auth: {
          user: "myname@myserver.com",
          pass: "mypass"
        },
        message: {
          addressed_to: "node-alert maintainer",
          serviceName: "Node-Alert test"
        }
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

new cron('0 * * * * *', function () {
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
    if (response.ctx.payload.hits.total > 10)
      alert.alertMail(new Error('There are ' + response.ctx.payload.hits.total +
        ' documents in your index. Threshold is 10'), function (err, info) {
          if (err) console.log(err);
          else console.log('Success!');
        });
  });
}, null, true, 'America/Los_Angeles');


