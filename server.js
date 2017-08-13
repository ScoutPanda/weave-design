// server.js
const express = require('express');

var bodyParser = require('body-parser');

const canvas = require('./backend/routes/canvas');
const adduser = require('./backend/routes/adduser');

const mongoose = require('mongoose')

const app = express();

// config files
//var db = require('./backend/config/db');

mongoose.connect('localhost:27017/testi');
//mongoose.connect('mongodb://heroku_pj7cvwvb:sp26kfoad9kkh3mmvjpt9gtag@ds123080.mlab.com:23080/heroku_pj7cvwvb');

const path = require('path');

/*
// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
const forceSSL = function() {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(
       ['https://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
}
// Instruct the app
// to use the forceSSL
// middleware
app.use(forceSSL());*/

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/api/canvas', canvas);
app.use('/api/adduser', adduser);

// Start the app by listening on the default
// Heroku port
//app.listen(process.env.PORT || 8080);
app.listen(4200)

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});