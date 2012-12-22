var dbfile = "db.json";
var fs = require('fs');
var data = {
  nrofusers: 0,
  msgs: [],
  users: {}
}

function save() {
  fs.writeFile(dbfile, JSON.stringify(data));
}

function load() {
  try {

  if (fs.lstatSync(dbfile).isFile()) {
    var string = fs.readFileSync(dbfile, 'utf8');
    if (string) {
      data = JSON.parse(string);
    }
  }
  } catch (e) {
    console.log(e);
  }
}

load();

exports.getUser = function(name) {
  return data.users[name];
}

exports.getUsers = function(name) {
  return data.users;
};;

exports.addUser = function(name, password) {
  return data.users[name] = {
    name: name,
    password: password,
    id: data.nrofusers++,
    msgs: []
  };
};

exports.addMessage = function(msg) {
  var from = exports.getUser(msg.from)
    , to = exports.getUser(msg.to);
  if(!from || !to) {
    return false;
  }
  msg.id = data.msgs.length;
  data.msgs.push(msg);
  from.msgs.push(msg.id);
  to.msgs.push(msg.id);
  save();
  return true;
}

exports.userHistory = function(user, callback) {
  if (typeof user === "string") {
    user = exports.getUser(user);
  }
  for (var i = 0; i < user.msgs.length; ++i) {
    callback(data.msgs[user.msgs[i]]);
  }
}

exports.getStatistics = function() {
  var stats = [];
  var msgs = data.msgs;
  var users = data.users;

  if (0 === msgs.length) {
    return null;
  }

  for (var user in users) {
    stats.push({name: user, msgs: {}});
  }
  stats.sort(function(a,b) { return users[a.name].id - users[b.name].id;});

  for (var i = 0; i < msgs.length; ++i) {
    var msg = msgs[i];
    var umsgs = stats[users[msg.from].id].msgs;
    umsgs[msg.to] = umsgs[msg.to] ? umsgs[msg.to] + 1 : 1;
  }
  
  return stats;
}
