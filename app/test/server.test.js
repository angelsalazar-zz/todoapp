const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server.js');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');


const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test thourgh supertest';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo
          .find({text})
          .then((docs) => {
            expect(docs.length).toBe(1);
            expect(docs[0].text).toBe(text);
            done();
          })
          .catch((e) => done(e))
      })
  })
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.docs.length).toBe(2);
      })
      .end(done)
  })
})

describe('GET /todos/:_id', () => {
  it('should get a todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.doc.text).toBe(todos[0].text);
      })
      .end(done)
  });

  it('should return 404', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done)
  });

  it('should return 404 due to invalid id', (done) => {
    request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done)
  })
})

describe('DELETE /todos/:_id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.doc._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo
          .findById(hexId)
          .then((todo) => {
            expect(todo).toNotExist();
            done();
          })
          .catch((err) => done(err));
      })
  })

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
      request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done)
  })

  it('should return 404, if object  id is invalid', (done) => {
    request(app)
      .delete ('/todos/1234')
      .expect(404)
      .end(done)
  })
});

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
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.user._id).toBe(users[0]._id.toHexString());
          expect(res.body.user.email).toBe(users[0].email);
        })
        .end(done);
  });

  it('should return 401 if no authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({message:'Unauthorized'});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'app@app.com';
    var password = '123456'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body.user.email).toBe(email);
        expect(res.body.user._id).toExist();
      })
      .end((err) => {
        if (err) {
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toExist()
          expect(user.password).toNotBe(password);
          done()
        }).catch((err) => done(err));
      });
  });

  it('should return validation erros if request invalid', (done) => {
    request(app)
      .post('/users')
      .send({})
      .expect(400)
      .end(done)
  });

  it('should not create a user if email is in used', (done) => {
    var email = users[0].email;
    var password = '123456';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });
})

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({email : users[1].email, password : users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access : 'auth',
            token : res.headers['x-auth']
          });
          done();
        })
        .catch((err) => done(err));

      });
  });

  it('should reject invalid login', (done) => {
    request(app)
      .post('/users/login')
      .send({email : users[1].email, password : users[1].password + '1'})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        })
        .catch((err) => done(err));

      });
  })
});


describe('DELETE /users/me/token', () => {
  it('should delete a token', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }

        User.findOne({
          email : users[0].email
        }).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => done(err));
      })
  })
})
