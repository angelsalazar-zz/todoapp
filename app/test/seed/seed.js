const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
  _id : userOneId,
  email : 'angel@angel.com',
  password : '123456',
  tokens : [{
    access : 'auth',
    token : jwt.sign({_id : userOneId, access : 'auth'},'somes3cr3t').toString()
  }]
},{
  _id : userTwoId,
  email : 'jesus@jesus.com',
  password : '654321'
}];


const todos = [{
  _id : new ObjectID(),
  text : 'first test todo'
}, {
  _id : new ObjectID(),
  text : 'second test todo',
  completed : true,
  completedAt : 333
}];

const populateTodos = (done) => {
  // console.log("beforeEach#######################################################");
  Todo
    .remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done())
};

const populateUsers = (done) => {
  User
  .remove({})
  .then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]);
  })
  .then(() => done());
}


module.exports = {todos, users, populateTodos, populateUsers};
