const {ObjectID} = require('mongodb');
const {mongoose} = require('./../app/database/db');
const {Todo} = require('./../app/models/todo');
const {User} = require('./../app/models/user');

// var newUser = new User({
//   email : 'angelsalazar1992@hotmail.com'
// })
//
// newUser
//   .save()
//   .then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
//   }, (e) => console.log('Unable to create user', e))

const userID = '58700c5f196a5643389d5f36';

User
  .findById(userID)
  .then((doc) => {
    if (!doc) {
      console.log('Unable to find user')
    } else {
      console.log(doc)
    }
  }, (e) => console.log(e))
// const id = '586fe48097314e15587a9d38'
//
// if (!ObjectID.isValid(id)) {
//   console.log('Id not valid')
// }
// return an array of documents
// Todo
//   .find({
//     _id : id
//   })
//   .then((docs) => {
//     console.log('todos', docs);
//   })
//
// // return a document
// Todo
//   .findOne({
//     _id : id
//   })
//   .then((doc) => {
//     console.log('todo', doc)
//   });

// Todo
//   .findById({
//     _id : id
//   })
//   .then((doc) => {
//     console.log('todo by id', doc)
//   });
