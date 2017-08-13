var mongoose = require('mongoose');
var Schema = mongoose.Schema

var schema = new Schema({
    canvasName: {type: String, require: true},
    canvasData: {type: String, required: true},
    authUserId: {type: String, ref: 'User'}
});

module.exports = mongoose.model('Canvas', schema);