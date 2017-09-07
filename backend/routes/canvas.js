const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

var User = require('../models/user');
var Canvas = require('../models/canvas');

router.get('/', function(req,res){
    var decoded = jwt.decode(req.query.token);
    var user_id = decoded.sub;
    Canvas.find({authUserId: user_id})
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

function checkCount (user_id, req, res){
    Canvas.count({authUserId: user_id}, function(err, count){
        if(err){
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        if(count > 9){
            return res.status(418).json({
                title: "I'm NOT a coffee pot >:(",
                error: 'Not enough storage space'
            });    
        }
        else
        {
            saveCanvasData(user_id, req, res);
        }
    });
}

function saveCanvasData(user_id, req, res){
    User.findOne({authUserId: user_id}, function(err, user){
        if(err){
        return res.status(500).json({
                title: 'An error occured',
                error: err
            });
        }
        var canvas = new Canvas({
            canvasName: req.body.canvasName,
            canvasData: req.body.canvasData,
            authUserId: user_id
        });
        canvas.save(function(err, result){
            if(err){
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            user.canvases.push(result);
            user.save();
            res.status(201).json({
                message: 'Saved canvas data',
                obj: result
            });
        });
    });
}

router.post('/', function(req, res){
    var decoded = jwt.decode(req.query.token);
    var user_id = decoded.sub;
    checkCount(user_id, req, res);
});

router.patch('/:id', function(req, res){
    Canvas.findById(req.params.id, function(err, canvas){
        if (err){
            return res.status(500).json({
                title: "An error occurred",
                error: err
            });
        }
        if(!canvas){
            return res.status(500).json({
                title: 'No canvas found',
                error: {canvas: 'Canvas not found'}
            });
        }
        canvas.canvasName = req.body.canvasName;
        canvas.canvasData = req.body.canvasData;
        canvas.save(function(err, result){
            if(err){
                return res.status(500).json({
                    title: 'An error occured',
                    error: err
                });
            }
            user.canvases.push(result);
            user.save();
            res.status(200).json({
                message: 'Updated canvas data',
                obj: result
            });
        });
    });
});

router.delete('/:id', function(req, res){
    Canvas.findById(req.params.id, function(err, canvas){
        if (err){
            return res.status(500).json({
                title: "An error occurred",
                error: err
            });
        }
        if(!canvas){
            return res.status(500).json({
                title: 'No canvas found',
                error: {canvas: 'Canvas not found'}
            });
        }
        canvas.remove(function(err, result){
            if(err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted canvas',
                obj: result
            });
        });
    });
});

module.exports = router;