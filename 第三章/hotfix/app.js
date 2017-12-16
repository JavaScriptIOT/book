var express = require('express');
var router = express.Router();
router.use(express.static('public'));
router.get('/echo', function(req, res){
  res.send(JSON.stringify({message:"Hello Word"}))});
module.exports = router;
