//jshint esversion:6
require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model('user', userSchema);

app.route('/')
.get((req, res) => {
  res.render('home');
});

app.route('/login')
.get((req, res) => {
  res.render('login');
})
.post((req, res) => {
  const userEmail = req.body.username;
  const userPassword = req.body.password;

  User.findOne({email: userEmail}, (err, data) => {
    if (!err) {
      if (data.password === userPassword) {
        res.render('secrets');
      } else {
        console.log('Incorrect password.');
        res.redirect('login');
      }
    } else {
      console.log(err);
    }
  });
});

app.route('/register')
.get((req, res) => {
  res.render('register');
})
.post((req, res) => {
  const userEmail = req.body.username;
  const userPassword = req.body.password;

  let newUser = new User({
    email: userEmail,
    password: userPassword
  });
  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render('secrets');
    }
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Ready. Set. Go.');
});
