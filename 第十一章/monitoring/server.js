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
 
alert.alertMail(new Error('Test Error'), function(err, info) {
  if (err) console.log(err);
  else console.log('Success!');
});
 