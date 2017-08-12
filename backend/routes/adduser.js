const express = require('express');
const router = express.Router();



router.post('/', function(req, res){
  console.log(req);
  console.log(req.body)
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