var ffi = require('ffi');
var libadc = ffi.Library('libadc', {
  'adc_init': [ 'void', [ 'int' ] ],
  'adc_queue_empty': [ 'int', [ ] ],
  'adc_queue_get': [ 'int', [ ] ]
});
libadc.adc_init(1000);
setInterval(function(){
   while (libadc.adc_queue_empty()==0){
   	console.log(libadc.adc_queue_get())
   }
}, 100)