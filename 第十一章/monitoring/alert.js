var cron = require('cron').CronJob;
var log4js = require('log4js');
log4js.configure({
  appenders: { server: { type: 'file', filename: 'server.log' } },
  categories: { default: { appenders: ['server'], level: 'error' } }
});
var logger = log4js.getLogger('server');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});

new cron('0 * * * * *', function () {
  client.search({
    index: 'iot',
    body: {
      query: {
        match_all: {}
      }
    }
  }, function (error, response) {
    if (response.ctx.payload.hits.total > 10)
    logger.error('There are ' + response.ctx.payload.hits.total +
        ' documents in your index. Threshold is 10')
  });
}, null, true, 'Asia/Shanghai');


