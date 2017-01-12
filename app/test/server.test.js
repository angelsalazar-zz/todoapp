const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');

const todos = [{
  _id : new ObjectID(),
  text : 'first test todo'
}, {
  _id : new ObjectID(),
  text : 'second test todo',
  completed : true,
  completedAt : 333
}]

beforeEach((done) => {
  console.log("beforeEach")
  Todo
    .remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done())
})

// describe('POST /todos', () => {
//   it('should create a new todo', (done) => {
//     var text = 'Test thourgh supertest';
//
//     request(app)
//       .post('/todos')
//       .send({text})
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.text).toBe(text);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//
//         Todo
//           .find({text})
//           .then((docs) => {
//             expect(docs.length).toBe(1);
//             expect(docs[0].text).toBe(text);
//             done();
//           })
//           .catch((e) => done(e))
//       })
//   })
//
//   it('should not create todo', (done) => {
//
//     request(app)
//       .post('/todos')
//       .send({})
//       .expect(400)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//
//         Todo
//           .find()
//           .then((docs) => {
//             expect(docs.length).toBe(2)
//             done()
//           })
//           .catch((e) => done(e))
//       })
//   })
// })
//
//
// describe('GET /todos', () => {
//   it('should get all todos', (done) => {
//     request(app)
//       .get('/todos')
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todos.length).toBe(2);
//       })
//       .end(done())
//   })
// })


// describe('GET /todos/:_id', () => {
//   it('should get a todo', (done) => {
//     request(app)
//       .get('/todos/' + todos[0]._id.toHexString())
//       .expect(200)
//       .expect((res) => {
//         // console.log(res)
//         expect(res.body.todo.text).toBe(todos[0].text);
//       })
//       .end(done())
//   })
//
//   it('should return 404 if todo not found', (done) => {
//     var hexId = new ObjectID().toHexString();
//     request(app)
//       .get(`/todos/${hexId}`)
//       .expect(404)
//       .end(done())
//   })
//
//   it('should return 404 for non-object ids', (done) => {
//     request(app)
//       .get('/todos/1234')
//       .expect(404)
//       .end(done())
//   })
// })

// describe('DELETE /todos/:_id', () => {
//   it('should remove a todo', (done) => {
//     var hexId = todos[1]._id.toHexString();
//     request(app)
//       .delete(`/todos/${hexId}`)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todo._id).toBe(hexId);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//
//         Todo
//           .findById(hexId)
//           .then((todo) => {
//             expect(todo).toNotExist();
//             done();
//           })
//           .catch((err) => done(err));
//       })
//     it('should return 404 if todo not found', (done) => {
//       var hexId = new ObjectID().toHexString();
//         request(app)
//           .delete(`/todos/${hexId}`)
//           .expect(404)
//           .end(done())
//     })
//
//     it('should return 404, if object  id is invalid', (done) => {
//       request(app)
//         .delete ('/todos/1234')
//         .expect(404)
//         .end(done())
//     })
//   })
//
// })


describe('PUT /todos/:_id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = "cool";
    var completed = true
    request(app)
      .put(`/todos/${hexId}`)
      .send({text,completed})
      .expect(200)
      .expect((res) => {
        expect(res.body.doc.text).toBe(text);
        expect(res.body.doc.completed).toBe(completed);
        expect(res.body.doc.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completed when the todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = "cool";
    var completed = false
    request(app)
      .put(`/todos/${hexId}`)
      .send({text,completed})
      .expect(200)
      .expect((res) => {
        expect(res.body.doc.text).toBe(text);
        expect(res.body.doc.completed).toBe(false);
        expect(res.body.doc.completedAt).toNotExist();
      })
      .end(done);
  });
})
