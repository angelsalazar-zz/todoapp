const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


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


// mongoose middleware "before save"
UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hashedPassword) => {
        user.password = hashedPassword;
        next();
      })
    })
  } else {
    next();
  }
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

UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
      $pull : {
        tokens : {token}
      }
    })
};

// Model methods
UserSchema.statics.findByCredentrials = function (email, password) {
  var User = this;
  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject('email or password incorrect');
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          resolve(user);
        } else {
          reject('email or password incorrect');
        }
      });
    });
  })
};
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
