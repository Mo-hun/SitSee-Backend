var express = require('express');
var router = express.Router();

console.log('webserver');
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.host =="www.xn--hs-k51jh73aj8b.com" || req.host == "xn--hs-k51jh73aj8b.com"){
    res.view('domain');
  }
  res.json({ message : 'fuck you!' });
});

module.exports = router;
