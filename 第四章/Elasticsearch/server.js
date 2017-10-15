var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

client.create({
  index: 'myindex',        
  type: 'mytype',          
  id: '1',                    
  body: {                     
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
      match: {                  
        title: 'test'          
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

    { index:  { _index: 'myindex', _type: 'mytype', _id: 1 } },
    { title: 'foo' },
    { update: { _index: 'myindex', _type: 'mytype', _id: 2 } },
    { doc: { title: 'foo' } },
    { delete: { _index: 'myindex', _type: 'mytype', _id: 3 } },

  ]}, function (err, resp) {
  // ...
});
