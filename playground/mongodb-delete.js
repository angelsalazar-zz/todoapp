// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Unable to connect to mongodb server');
  } else {
    console.log('Connected to mongodb server');
  }

  // DeleteMany
  // db
  //   .collection('Todos')
  //   .DeleteMany({ text : 'same text'})
  //   .then((result) => {
  //     console.log(result);
  //   }, (err) => {
  //     console.log(err);
  //   })
  // deleteOne
  // db
  //   .collection('Todos')
  //   .deleteOne({text : 'same text'})
  //   .then((result) => {
  //     console.log(result);
  //   }, (err) => {
  //     console.log(err);
  //   })586e872fb107e737f018db0d
  // FindOneAndDelete
  db
    .collection('Todos')
    .findOneAndDelete({_id : new ObjectID('586e872fb107e737f018db0d')})
    .then((result) => {
      console.log(JSON.stringify(result,undefined,2))
    }, (err) => {
      console.log(err)
    })

  //db.close();
})
