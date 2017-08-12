var mongoose = require('mongoose');
var Schema = mongoose.Schema
var uniqueValidator = require('mongoose-unique-validator')

var schema = new Schema({
    email: {type: String, required: true, unique: true},
    canvases: [{type: Schema.Types.ObjectId, ref: 'Canvas'}],
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model('User', schema);