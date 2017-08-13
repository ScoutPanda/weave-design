const express = require('express');
const router = express.Router();

var User = require('../models/user');

router.post('/', function(req, res){
    var b64string = req.body;
    var buf = new Buffer(b64string, 'base64');
    var call = JSON.parse(buf.toString());
    if(req.header("secret") === "{tosikovasalaisuus12345}"){
        var user = new User({
            authUserId: call.properties.distinct_id,
            email: call.properties.distinct_email
        });
        user.save(function(err, result){
            if(err){
            return res.status(500).json({
                title: 'An error occured',
                error: err
            });
            };
            res.status(201).json({
            message: 'Saved user data',
            obj: result
            });
        });
    }else{
        res.status(403).json({
            title: 'UNAUTHORIZED',
            error: err
        });
    }
});

module.exports = router;