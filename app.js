var express = require('express');
var app = express();

// set the port of our application
var port = process.env.PORT || 8080;

// make express look in the client directory for assets (css/js/img/html)
app.use(express.static(__dirname + '/client'));

// set the home page route
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.listen(port, function() {
    console.log('Server running on http://localhost:' + port);
});

