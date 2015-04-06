var express =require('express'),
    http = require('http'),
    path = require('path'),
    app = express(),
    expressJwt = require('express-jwt');
	server = http.createServer(app);
var bodyParser = require('body-parser');
var stringify = require('node-stringify');

var index = require('./routes/index');
var	user = require('./routes/user/');
//KYULI VERIFY
//var verify = require('./models/verify');
var secret = 'secretkey';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json 
app.use(bodyParser.json());

//KYULI.YEO ROUTER
//app.use('/api', verify);
//app.use('/', expressJWT({secret : 'secret' }).unless({path :['/user']}));
app.use('/index', index);

//Jeon ROUTER
app.use('/user', user);


server.listen(3300, function(){
	console.log('start server ' + server.address().port);
});

