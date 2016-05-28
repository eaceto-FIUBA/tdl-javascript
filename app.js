var express = require('express');
var app = express();

// set the port of our application
var port = process.env.PORT || 8080;

// make express look in the client directory for assets (css/js/img/html)
app.use(express.static(__dirname + '/client'));

var users = {};

// set the home page route
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.put('/api/user/:username/join', function(req, res) {
    var username = req.params.username;
    if (username in users) {
        var e = {"error": "El usuario '" + username + "' ya existe en la sala."};
        res.json(e);
        res.status(409);
        return;
    }
    console.log("[JOIN]\t" + username);
    var e = {"username": username};
    users[username] = true;
    res.json(e);
    res.status(201);
});

app.delete('/api/user/:username/leave', function(req, res) {
    var username = req.params.username;
    if (username in users) {
        console.log("[LEAVE]\t" + username);
        delete users[username];
        res.status(200);
        res.end();
        return;
    }
    res.status(404);
});


app.listen(port, function() {
    console.log('Server running on http://localhost:' + port);
});

