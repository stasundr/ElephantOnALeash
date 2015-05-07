// setup
var setup = require('./parts/setup');
var passport = require('passport');
require('./parts/passport')(passport);

// express app
var app = setup.createExpressApp(passport);
module.exports = app;

// routes
require('./parts/routes')(app, passport);