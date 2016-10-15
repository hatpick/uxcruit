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
  studyCollection: [{type: mongoose.Schema.Types.ObjectId, ref: 'Study'}]
});

experimenterSchema.methods.addStudy = function(study) {
  this.studyCollection.push(study);
  this.save();
}

experimenterSchema.methods.removeStudy = function(id) {  
  console.log(id);
  for(var i = 0; i < this.studyCollection.length ; i++)
  {    
    if(this.studyCollection[i] == id)
    {
      this.studyCollection.splice(i,1);
      break;
    }
  }
  this.save();
}

experimenterSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
experimenterSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Experimenter', experimenterSchema);