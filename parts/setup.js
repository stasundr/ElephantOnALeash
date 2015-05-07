var config = require('./../config');
var redis = require('./redis');

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var redisStore = require('connect-redis')(session);

module.exports.createExpressApp = function(passport) {

    var app = express();

    app.set('view engine', 'ejs');

    app.disable('etag'); // http://stackoverflow.com/questions/18811286/nodejs-express-cache-and-304-status-code

    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded( { extended: false } ));
    app.use(express.static(config.directory + '/public'));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        store: new redisStore({ client: redis }),
        resave: false,
        saveUninitialized: true,
        secret: config.sessionSecret
    }));


    return app;
};