var express =require('express'),
    http = require('http'),
    path = require('path'),
    app = express(),
    expressJwt = require('express-jwt');
	server = http.createServer(app);
var bodyParser = require('body-parser');
var stringify = require('node-stringify');

var index = require('./routes/index');
var	sign = require('./routes/sign');
var verify = require('./models/verify');

// parse application/x-www-form-urlencoded (disabled)
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json 
app.use(bodyParser.json());

//KYULI.YEO ROUTER
app.use('/', index);
app.use('/', verify);

//Jeon ROUTER
app.use('/sign', sign);

server.listen(3300, function(){
	console.log('start server ' + server.address().port);
});

