// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Unable to connect to mongodb server');
  } else {
    console.log('Connected to mongodb server');
  }

  db
    .collection('Todos')
    .findOneAndUpdate({
        _id : new ObjectID('586e874f3410e043cc607c6c')
    }, {
      $set : {
        completed : true
      }
    }, {
        returnOriginal : false
    })
    .then((result) => {
      console.log(JSON.stringify(result,undefined,2));
    })
  //db.close();
})
