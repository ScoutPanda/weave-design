const express = require('express');
const router = express.Router();

router.post('/', function(req, res){
    var b64string = req.body;
    var buf = new Buffer(b64string, 'base64');
    var call = JSON.parse(buf);
    console.log(call)
  /*canvas.save(function(err, result){
      if(err){
          return res.status(500).json({
            title: 'An error occured',
            error: err
          });
      }
      res.status(201).json({
          message: 'Saved canvas data',
          obj: result
      });
  });*/
});

module.exports = router;