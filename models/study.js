var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    studySchema;

studySchema = new Schema({
  investigatorName: {type:String, required: true},
  investigatorEmail: {type:String, required: true},
  title: {type:String, required: true},
  description: {type:String, required: true},  
  price: {type: Number, required: true, default: 0},
  location: {type:String, required: true},
  category: {type:String, required: true},
  tags: {type:String},
  createdAt: {type: Date, default: Date.now},
  modifiedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Study', studySchema);