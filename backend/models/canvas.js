var mongoose = require('mongoose');
var Schema = mongoose.Schema

var schema = new Schema({
    canvasName: {type: String, require: true},
    canvasData: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Canvas', schema);