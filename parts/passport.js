var config = require('./../config');
var redis = require('./redis');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;

var local = new LocalStrategy(
    function(username, password, done) {
        console.log('elephant:user:' + username);
        redis.get('elephant:user:' + username, function(error, userData) {

            crypto.pbkdf2(password, config.cryptoSalt, 4096, 512, 'sha256', function(error, key) {
                if (error) throw error;

                var user = JSON.parse(userData);
                if (user === null) done(null, null);
                else {
                    if (user.password === key.toString('hex')) done(null, user);
                    else done(null, null);
                }
            });

        });
    }
);

module.exports = function (passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.username)
    });

    passport.deserializeUser(function(id, done) {
        redis.get('elephant:user:' + username, function(error, userData) {
            var user = JSON.parse(userData);
            var userFace = {
                username: user.username,
                name: user.name,
                gender: user.gender,
                password: user.password
            };

            done(null, userFace);
        });
    });

    passport.use(local);
};