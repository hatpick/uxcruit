var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt-nodejs');

var Schema = mongoose.Schema,
    experimenterSchema;

experimenterSchema = new Schema({
  username: {type:String, required: true, unique: true},
  password: {type:String, required: true},
  affiliation: {type:String, required: true},
  email: {type:String, required: true, unique: true},  
  firstName: {type:String, required: true},
  lastName: {type:String, required: true},
  phoneNumber: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  lastLogin: {type:Date, default: Date.now},
  role: {type: String, default: 'experimenter'},
  experimenterCollection: [{type: mongoose.Schema.Types.ObjectId, ref: 'Experimenter'}]
});

experimenterSchema.methods.addExperimenter = function(experimenter) {
  this.experimenterCollection.push(experimenter);
  this.save();
};

experimenterSchema.methods.removeExperimenter = function(id) {  
  for(var i = 0; i < this.experimenterCollection.length ; i++)
  {
    console.log(this.experimenterCollection[i]);
    if(this.experimenterCollection[i] === id)
    {
      this.experimenterCollection.splice(i,1);
      break;
    }
  }
  this.save();
};

experimenterSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
experimenterSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Experimenter', experimenterSchema);