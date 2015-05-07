var redis = require('./redis');
var validate = require('./validate');

module.exports = function(app, passport){

    app.get('/', function(request, response) {
        if (request.session.isAuthenticated) {
            redis.lrange('elephant:weight:' + request.session.username, 0, -1, function(error, weight_calendar) {

                if (!weight_calendar.length) {
                    weight_calendar.push(JSON.stringify({
                        weight: 0,
                        date: new Date()
                    }));
                }

                var a = [];
                for (var i = 0; i < weight_calendar.length; i++) {
                    a.push(JSON.stringify({weight: JSON.parse(weight_calendar[i]).weight, date: i}));
                }

                response.render('index.ejs', {
                    isAuthenticated: true,
                    name: request.session.name,
                    weight_calendar: weight_calendar
                });
            });
        } else response.render('index.ejs', { isAuthenticated: false });
    });

    app.get('/logout', function(request, response) {
        request.session.destroy();
        request.logout();
        response.redirect('/');
    });

    app.post('/weight', function(request, response) {
        request.body.weight = request.body.weight.replace(/,/, '.');

        if (!isNaN(request.body.weight)) {
            redis.rpush('elephant:weight:' + request.session.username, JSON.stringify({
                weight: request.body.weight.replace(/^0+/, ''),
                date: new Date()
            }));
        }

        response.redirect('/');
    });

    app.get('/registration', function(request, response) {
        response.render('registration.ejs');
    });

    app.post('/registration', function(request, response) {
        var email = request.body.username;
        if (!validate.email(email)) {
            response.render('registration.ejs', { problem: 'bad email' });
        }

        redis.get('elephant:user:' + email, function(error, user) {
            var answer = {};
            if (user) answer.problem = 'user found';
            if (request.body.password != request.body.confirmation) answer.problem = 'confirmation fail';
            if (validate.password(request.body.password) != 'ok') answer.problem = validate.password(request.body.password);

            if (answer.hasOwnProperty('problem')) response.render('registration.ejs', answer);
            else {
                redis.createUser(request.body);
                response.redirect('/');
            }
        });
    });

    app.post('/auth', passport.authenticate('local'), function(request, response) {
        redis.get('elephant:user:' + request.body.username, function(error, user) {
            request.session.isAuthenticated = true;
            request.session.name = JSON.parse(user).name;
            request.session.username = JSON.parse(user).username;
            response.redirect('/');
        });
    });
};