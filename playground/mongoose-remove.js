const {ObjectID} = require('mongodb');
const {mongoose} = require('./../app/database/db');
const {Todo} = require('./../app/models/todo');
const {User} = require('./../app/models/user');

// Delete all docs that match the object
Todo
  .remove({})
  .then((result) => {
    console.log(result);
  });


Todo
  .findOneAndRemove({})
  .then((todo) => {
    console.log(todo);
  });

Todo
  .findByIdAndRemove()
  .then((todo) => {
    console.log(todo);
  })
