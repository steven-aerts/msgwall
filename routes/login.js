var db = require("../db");
var crypto = require('crypto');

/*
 * GET home page.
 */

exports.index = function(req, res, next){
  var username = req.param('user', "");
  var password = passCrypt(username, req.param('password', ""));
  var error;

  if (username.length == 0) {
    error = "";
  }

  if (password.length == 0) {
    error = "Geen wachtwoord ingegeven?";
  }

  var user = db.getUser(username);
  if (user && user.password !== password) {
    error = "Verkeerd wachtwoord voor '" + username + "'";
  }

  if (! user) {
    user = db.addUser(username, password);
    sockets.newUser(username);
  }

  if (error !== undefined) {
    return res.render('login', {error:error, username:username});
  }

  req.session.user = user.name;
  req.user=user;
  res.redirect("/");
};

exports.requireAuthentication = function(req, res, next){
  if (req.path === "/login") {
    return next();
  }

  if (! req.session.user) {
    return res.redirect('/login');
  }

  req.user = db.getUser(req.session.user);
  if (! req.user) {
    return res.redirect('/login');
  }

  next();
};

exports.logout = function(req, res, next) {
  req.session.destroy();
  delete req.user;
  res.redirect('/');
};

function passCrypt(user, pass) {
  var shasum = crypto.createHash('sha1');
  shasum.update("foute fuif");
  shasum.update(user);
  shasum.update(pass);
  return shasum.digest("hex");
}
