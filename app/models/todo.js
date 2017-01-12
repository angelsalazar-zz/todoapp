var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var TodoSchema = new Schema({
  text : {
    type : String,
    required : true,
    minlength : 1,
    trim : true
  },
  completed : {
    type : Boolean,
    default : false
  },
  completedAt : {
    type : Number,
    default: null
  }
})

TodoSchema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
});

var Todo = mongoose.model('Todo', TodoSchema);

module.exports = {Todo};
