var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    categorySchema;

categorySchema = new Schema({  
  title: {type:String, required: true},
  description: {type:String},  
  createdAt: {type: Date, default: Date.now},
  modifiedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Category', categorySchema);