var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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
    var socket = req.params.socket;
    if (username in users) {
        var e = {"error": "El usuario '" + username + "' ya existe en la sala."};
        res.json(e);
        res.status(409);
        return;
    }
    console.log("[JOIN]\t" + username);
    var e = {"username": username, "socket": socket};
    users[username] = socket;
    sockets[socket] = username;
    res.json(e);
    res.status(201);
});

app.delete('/api/user/:username/leave', function(req, res) {
    var username = req.params.username;
    if (username in users) {
        console.log("[LEAVE]\t" + username);
        var socket = users[username];
        delete users[username];
        delete sockets[socket];
        res.status(200);
        res.end();
        return;
    }
    res.status(404);
});

io.on('connection', function(socket) {
    console.log('a user connected');
});


app.listen(port, function() {
    console.log('Server running on http://localhost:' + port);
});

