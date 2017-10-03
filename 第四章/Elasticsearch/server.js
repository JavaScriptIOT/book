var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

client.create({
  index: 'myindex',        //文档所属的索引
  type: 'mytype',           //文档所属类型
  id: '1',                    //文档的唯一ID
  body: {                     // 文档主体
    title: 'Test 1',
    tags: ['y', 'z'],
    published: true,
    published_at: '2013-01-01',
    counter: 1
  }}, function (error, response) {


});


client.search({
  index: 'myindex',     
  body: {
    query: {
      match: {                  //使用匹配查询
        title: 'test'          //title字段必须等于test
      }
    }
 }
}, function (error, response) {

});



client.update({
  index: 'myindex',
  type: 'mytype',
  id: '1',
  body: {
    // ElasticSearch支持文档的部分跟新，这里只跟新doc字段
    doc: {
      title: 'Updated'
    }
  }}, function (error, response) {

})



client.delete({
  index: 'myindex',
  type: 'mytype',
  id: '1'}, function (error, response) {

});



client.bulk({
  body: [
    // action description
    { index:  { _index: 'myindex', _type: 'mytype', _id: 1 } },
     // the document to index
    { title: 'foo' },
    // action description
    { update: { _index: 'myindex', _type: 'mytype', _id: 2 } },
    // the document to update
    { doc: { title: 'foo' } },
    // action description
    { delete: { _index: 'myindex', _type: 'mytype', _id: 3 } },
    // no document needed for this delete
  ]}, function (err, resp) {
  // ...
});
