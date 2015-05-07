var config = require('./../config');

var redis = require('redis');
var crypto = require('crypto');

var client = redis.createClient(config.redisPort, config.redisHost);

if (config.redisAuth) {
    client.auth(config.redisAuth);
}

client.on('error', function(error) {
    throw error;
});

module.exports = client;

module.exports.createUser = function(data) {
    crypto.pbkdf2(data.password, config.cryptoSalt, 4096, 512, 'sha256', function(error, key) {
        if (error) throw error;

        var user = {};
        user.name = data.name;
        user.username = data.username;
        user.gender = data.gender;
        user.password = key.toString('hex');

        client.set('elephant:user:' + user.username, JSON.stringify(user));
    });
};