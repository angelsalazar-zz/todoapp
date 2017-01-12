const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
var Schema = mongoose.Schema;

var TokenSchema = new Schema({
  access : {
    type : String,
    required : true
  },
  token : {
    type : String,
    required : true
  }
});
var UserSchema = new Schema({
  email : {
    type : String,
    required : true,
    trim : true,
    minlength : 1,
    unique : true,
    validate : {
      validator : validator.isEmail,
      message : '{VALUE} is not a valid email'
    }
  },
  password : {
    type : String,
    required : true,
    minlength : 6
  },
  tokens : [TokenSchema]
});

// Instance method
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObj = user.toObject();

  return _.pick(userObj, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id : user._id.toHexString(), access}, 'somes3cr3t').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
      });
};

// Model methods
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'somes3cr3t');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id' : decoded._id,
    'tokens.token' : token,
    'tokens.access' : 'auth'
  })

};
var User = mongoose.model('User', UserSchema);

module.exports = {User};
