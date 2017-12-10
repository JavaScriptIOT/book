var cron = require('cron').CronJob;
var log4js = require('log4js');
log4js.configure({
  appenders: { 'file': { type: 'file', filename: 'server.log' },
               'console': { type: 'stdout' } },
  categories: { default: { appenders: ['file','console'], level: 'error' } }
});
var logger = log4js.getLogger();
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});

new cron('* * * * * *', function () {
  client.search({
    index: 'iot',
    body: {
      query: {
        match_all: {}
      }
    }
  }, function (error, response) {
    for (var i in response.hits.hits) {
      var doc = response.hits.hits[i]._source
      if (doc.ctx.payload.hits.total > 10)
        logger.error('There are ' + doc.ctx.payload.hits.total +
          ' documents in your index. Threshold is 10')
    }

  });
}, null, true, 'Asia/Shanghai');