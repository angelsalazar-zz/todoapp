// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    console.log('Unable to connect to mongodb server');
  } else {
    console.log('Connected to mongodb server');
  }
  // db
  //   .collection('Todos')
  //   .insertOne({
  //     'text' : 'Some todo',
  //     'completed' : false
  //   }, (err, result) => {
  //     if (err) {
  //       console.log("Unable to insert todo", err)
  //     } else {
  //       console.log(JSON.stringify(result.ops, undefined, 2))
  //     }
  //   })
  // db
  //   .collection('Users')
  //   .insertOne({
  //     'name' : 'Roger',
  //     'lastname' : 'Doe',
  //     'age' : 24,
  //     'location' : 'Monterrey'
  //   }, (err, result) => {
  //     if (err) {
  //       console.log('Unable to insert user', err);
  //     } else {
  //       console.log(JSON.stringify(result.ops, undefined, 2));
  //       console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  //
  //     }
  //   });
  db.close();
})
