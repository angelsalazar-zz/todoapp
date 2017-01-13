require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./database/db');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());


app
  .route('/users/login')
  .post((req, res) => {
    var body = _.pick(req.body,['email', 'password']);
    User
      .findByCredentrials(body.email, body.password)
      .then((user) => {
        return user.generateAuthToken().then((token) => {
          res
            .header('x-auth', token)
            .json({user})
        })
      })
      .catch((error) => {
        res
          .status(400)
          .json({error})
      })
  });

app
  .route('/users/me/token')
  .delete(authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
      res.status(200).json();
    })
    .catch((err) => {
      res.status(400).json();
    })
  })

app
  .route('/users')
  .post((req, res) => {
    var body = _.pick(req.body, ['email', 'password'])

    var user = new User({
      email : body.email,
      password : body.password
    });

    user
      .save()
      .then(() => {
        return user.generateAuthToken();
      })
      .then((token) => {
        res
          .header('x-auth', token)
          .json({user})
      })
      .catch((err) => {
        res
          .status(400)
          .json(err)
      })
  });


app
  .route('/users/me')
  .get(authenticate, (req, res) => {
    var {user} = req;
    res.status(200).json({user})
  })

app
  .route('/todos')
  .post(authenticate, (req, res) => {
    var todo = new Todo({
      text : req.body.text,
      _creator : req.user._id
    });
    todo
      .save()
      .then((doc) => {
        res
          .status(200)
          .json(doc);
        }, (e) => {
          res
            .status(400)
            .json(e);
      })
  })
  .get(authenticate, (req, res) => {

    Todo
      .find({_creator : req.user._id })
      .then((docs) => {
        res
          .status(200)
          .json({docs})
      }, (e) => {
        res
          .status(400)
          .json(e);
      })
  })
app
  .route('/todos/:_id')
  .get(authenticate, (req, res) => {
    var todoId = req.params._id;
    if (!ObjectID.isValid(todoId)) {
      res
        .status(404)
        .json({
          message : 'Invalid id',
          type : 'error'
        })
      return;
    }

    Todo
      .findOne({
        _id : todoId,
        _creator : req.user._id
      })
      .then((doc) => {
        if (!doc) {
          res
            .status(404)
            .json({ message : 'Todo ' + todoId + ' not found'})
          return;
        }
        res
          .status(200)
          .json({doc})
      }, (e) => {
        res
          .status(400)
          .json(e)
      })
  })
  .delete(authenticate, (req, res) => {
    var todoId = req.params._id;
    if (!ObjectID.isValid(todoId)) {
      res
        .status(404)
        .json({
          message : 'Invalid id',
          type : 'error'
        })
      return;
    }

    Todo
      .findOneAndRemove({
        _id : todoId,
        _creator : req.user._id
      })
      .then((doc) => {
        if (!doc) {
          res
            .status(404)
            .json({ message : 'Todo ' + todoId + ' not found'})
          return;
        }
        // doc.remove();
        res
          .status(200)
          .json({doc})
      }, (err) => {
        res
          .status(400)
          .json(err);
      })
  })
  .put(authenticate, (req, res) => {
    var todoId = req.params._id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(todoId)){
      return res.status(404).json({
        message : 'Invalid id',
        type : 'error'
      });
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    Todo
      .findOneAndUpdate({
        _id : todoId,
        _creator : req.user._id
      }, { $set : body}, { new : true})
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({ message : 'Todo ' + todoId + ' not found'})
        }
        res.status(200).json({doc});
      })
      .catch((err) => {
        return res.status(400).json(err)
      })


  });


app.listen(port, (e) => {
  if (e) {
    console.log('Whoops something went horribly wrong', e);
  } else {
    console.log(`Started on port ${port}`);
  }
})

module.exports = {app};
