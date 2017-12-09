var cron = require('cron').CronJob;
var log4js = require('log4js');
var config = {
  "appenders": [  
    { "type": "console" },  
    { "type": "file", "filename": "server.log",  "category": "server" },
        { "type": "dateFile", "filename": "history.log",  
    "layout": {"type":"basic"},"pattern": ".yyyy-MM-dd",   
    "alwaysIncludePattern": true, "category": "server" }
  ],  
  "levels": {  
    "server": "INFO"  
  }
}

log4js.configure({appenders:config.appenders,levels:config.levels});  
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
    logger.info('There are ' + response.ctx.payload.hits.total +
        ' documents in your index. Threshold is 10')
  });
}, null, true, 'Asia/Shanghai');


