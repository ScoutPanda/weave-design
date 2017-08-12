const express = require('express');
const router = express.Router();

var Canvas = require('../models/canvas');

router.get('/', function(req,res){
    Canvas.find()
        .exec(function(err, canvas){
            if(err){
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            res.status(201).json({
                message: 'Got canvas data',
                obj: canvas
            });
        });
})

router.post('/', function(req, res){
  var canvas = new Canvas({
      canvasName: req.body.canvasName,
      canvasData: req.body.canvasData
  });
  canvas.save(function(err, result){
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
  });
});

module.exports = router;