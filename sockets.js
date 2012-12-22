var db = require("./db");

exports.listen = function(server, cookieParser, sessionStore) {
  var io = require("socket.io").listen(server);
  var userSockets = {};

  io.configure(function (){
    io.set('authorization', function (data, accept) {
      if (!data.headers.cookie) 
        return accept('No cookie transmitted.', false);
    
      cookieParser(data, {}, function (parseErr) {
        if (parseErr)
          return accept('Error: ' + parseErr, false);
        
        sessionStore.load(findCookie(data), function (storeErr, session) {
          if (storeErr || ! session)
            return accept('Error: ' + storeErr, false);

          data.session = session;
          accept(null, true);
        });
      });
    });
  });

  var stats = io.of("/stats");

  io.sockets.on("connection", function(socket) {
    var user = db.getUser(socket.handshake.session.user);
    var arr = userSockets[user.name] = userSockets[user.name] || [];
    arr.push(socket);

    db.userHistory(user, function(msg) {socket.emit('message',msg);});

    socket.on('message', function(msg) {
      msg.from = user.name;
      if (db.addMessage(msg)) {
        var receivers = userSockets[msg.to];
        if (receivers) {
          for(var i = 0; i < receivers.length; ++i) {
            receivers[i].emit('message', msg);
          }
        }
        socket.emit('message', msg);
        updateStats();
      }
    });

    socket.on('disconnect', function () {
      var pos;
      for (pos = 0; pos < arr.length && arr[pos] != socket; ++pos);
      arr.splice(pos,1);
    });
  });

  function updateStats() {
    var data = db.getStatistics();
    if (data) {
      stats.volatile.emit("update", data);
    }
  }

  stats.on('connection', function (socket) {
    updateStats();
  });

  return {
    newUser: function(username) {
      io.sockets.emit("newuser",username);
      updateStats();
    }
  };
};

var key = "connect.sid";
function findCookie(handshake) {
  return (handshake.secureCookies && handshake.secureCookies[key])
      || (handshake.signedCookies && handshake.signedCookies[key])
      || (handshake.cookies && handshake.cookies[key]);
}
