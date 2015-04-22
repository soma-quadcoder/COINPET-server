/* 
 * 2015.4.2
 * Created by jeon
 * Sign up & Sign in module
 * rainsy02@gmail.com
 *
 *
 */


var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var ejwt = require('express-jwt');
//var crypto = require('crypto');
var child = require('./child');
var secretKey = require('./jwtKey');
var conn = require('../db-jeon');

console.log("./router/user/parents.js is loaded");

conn.getConnection(function(err){
    if(err){
        console.error('MySQL connection err');
        throw err;
    }
});

function post (req, res){
    console.log("POST /user/parents is called.");

    var user = {
        'email' : req.body.email,
		'passwd' : req.body.passwd
    }

    if (user.email == null || user.passwd == null) {
        console.log("Error : Invaild value");
	res.status(500).json({"error":"Invaild_value"});
        return;
    }

    var Query =  conn.query('insert into parents set ?', user,  function(err, result){
        if(err){
            var errArray = err.toString().split(':');
            console.log("Error");

            switch(errArray[1])
            {
                case " ER_DUP_ENTRY":
                    console.log("Duplicated Entry");
                    res.status(500).json({ 'error': 'Duplicated email' });
                    break;

                default:
                    console.log(err);
                    res.status(500).json();
            }
        }else{
            var payload = {
                'email' : req.body.email,
                'fk_parents' : result.insertId
            };

            var token = { 'Authorization': jwt.sign(payload, secretKey)};
            res.json(token);
        }
    });
}

function get (req, res){
    console.log("GET /user/parents is called.");

    var condition =
        "'email'='"+conn.escape(req.query.email)+
        "' AND 'passwd'='"+conn.escape(req.query.passwd)+"'";

    var Query = conn.query("select * from parents WHERE "+condition, function(err, rows){
        if(err) {
            console.log("Error : Cannot execute query");
            res.status(500).send();
        }else {
            console.log(rows);
            res.json(rows);
        }

    });
    console.log(Query);
}

function put (req, res){
    console.log("PUT /user/parents is called");

    var pn = req.body.pn;
    var condition = "product_num = "+pn+" AND used=1";

    conn.query("SELECT fk_kids FROM product_num WHERE "+condition, function(err,result) {
    if(err){
	    console.log("Error : Cannot execute query");
	    console.log(err);
		console.log(this.sql);
	    res.status(500).json({"error":"Fail_query"});
	}else if(result.length == 0) {
        res.json({"error": "Invaild_pn"});
    }else{
	    var fk_kids = result[0].fk_kids;
        res.json({"fk_kids" : fk_kids});
	}
    });
}

function remove (req, res){
    console.log("DELETE /user/parents is called");

}

var login = function (req, res) {
    console.log("POST /user/parents/login is called");

    var email = req.body.email;
    var passwd = req.body.passwd;

    var condition = "email='"+email+"' AND "+
                    "passwd='"+passwd+"'";

    conn.query("SELECT pk_parents FROM parents WHERE "+condition, function(err, result) {
        if (err) {
            console.log("Error : Cannot execute query");
            console.log(err);
            console.log(this.sql);
            res.status(500).json({"error":"Fail_query"});
        } else if (result.length ==0 ) {
            console.log("Error : Cannot log-in");
            console.log("email : "+email);
            console.log("passwd : "+passwd);
            console.log(this.sql);
            console.log(this.sql);
            console.log(result);
            res.status(500).json({"error":"Fail_login"});
        } else {
            var fk_parents = result[0].pk_parents;
            res.json( {'Authorization' : jwt.sign({'email':email, 'fk_parents':fk_parents}, secretKey) } );
        }
    });
}

router.post('/', post);

// read
router.get('/', ejwt({secret: secretKey}), get);

// update
router.put('/', ejwt({secret: secretKey}), put);

// remove
router.delete('/', ejwt({secret: secretKey}), remove);

router.use('/child', ejwt({secret: secretKey}), child);

router.post('/login', login);

module.exports = router;
