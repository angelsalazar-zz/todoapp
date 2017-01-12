require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./database/db');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

app
  .route('/todos')
  .post((req, res) => {
    var todo = new Todo({
      text : req.body.text
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
  .get((req, res) => {
    Todo
      .find()
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
  .get((req, res) => {
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
        _id : todoId
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
  .delete((req, res) => {
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
        _id : todoId
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
  .put((req, res) => {
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
      .findByIdAndUpdate(todoId, { $set : body}, { new : true})
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
