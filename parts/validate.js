module.exports.email = function(email) {
    var check = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return check.test(email);
};

module.exports.password = function(password) {
    if (password.length < 6) {
        return ('too short');
    } else if (password.length > 50) {
        return ('too long');
    } else if (password.search(/\d/) == -1) {
        return ('no num');
    } else if (password.search(/[a-zA-Z]/) == -1) {
        return ('no letter');
    } else if (password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
        return ('bad char');
    }

    return ('ok');
};