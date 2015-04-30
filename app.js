var express =require('express'),
	http = require('http'),
	path = require('path'),
	app = express(),
	multer = require('multer');
expressJwt = require('express-jwt');
unless = require('express-unless');
server = http.createServer(app);
var bodyParser = require('body-parser');
var stringify = require('node-stringify');
var index = require('./routes/index');
var secretKey = require('./jwtKey');

// parse aapplication/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended : true }));
// parse application/json
app.use(bodyParser.json());
//for parsing multipart/form-data
app.use(multer());

//KYULI.YEO ROUTER
// intercept all calls to API and validae the token
app.use('/', index);

/*
//error handler
//catch 404 and forwading to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//development error handler, will print stacktrace
if(app.get('env') === 'devlopment'){
	app.use(function(err, req, res, next){
		res.status(err.status || 500);
		res.render('error' , { message : err.message, error : {}
		});
	});
}

//production error handler no stacktraces leaked to user
app.use(function(err, req, res, next){
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error: {}
	});
});
*/

server.listen(3300, function(){
		console.log('start server ' + server.address().port);
});
