var express = require('express');
var app = express();
var http = require('http').Server(app);

// set the port of our application
var port = process.env.PORT || 8080;

// make express look in the client directory for assets (css/js/img/html)
app.use(express.static(__dirname + '/client'));

var users = {};
var sockets = {};

// set the home page route
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.put('/api/user/:username/join/:socket', function(req, res) {
    var username = req.params.username;
    var socketid = "#" + req.params.socket;
    if (username in users) {
        var e = {"error": "El usuario '" + username + "' ya existe en la sala."};
        res.json(e);
        res.status(409);
        return;
    }
    console.log("[JOIN]\t" + username);
    var e = {"username": username, "socket": socketid};
    users[username] = socketid;

    var socket = sockets[socketid];
    if (socket) {
        socket.to('others').emit('message', {username: username, message: "<Ingreso al chat>"});
    }

    res.json(e);
    res.status(201);
});

app.delete('/api/user/:username/exit', function(req, res) {
    var username = req.params.username;
    if (username in users) {
        console.log("[LEAVE]\t" + username);
        var socketid = users[username];
        delete users[username];

        var socket = sockets[socketid];
        console.log("will close socket: " + socketid);
        if (socket != undefined) {
            socket.disconnect();
        }
        delete sockets[socketid];
        res.status(200);
        res.end();
        return;
    }
    res.status(404);
});

var io = require('socket.io').listen(app.listen(port, function() {
        console.log('Server running on http://localhost:' + port);
    })
);

io.on('connection', function(socket) {
    var sid = socket.id.replace("/","");
    sockets[sid] = socket;
    socket.on('chat', function(msg) {
        var username = msg.username;
        var message = msg.message;

        console.log("[CHAT]\tfrom: '" + username + "' - message: '" + message + "'");
        socket.to('others').emit('chat', {username: username, message: message});
    });
});

