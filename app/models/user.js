var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
  email : {
    type : String,
    required : true,
    trim : true,
    minlength : 1
  }
})
var User = mongoose.model('User', UserSchema);

module.exports = {User};
