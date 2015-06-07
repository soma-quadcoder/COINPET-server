/*
 * 2015.6.7
 * Created by kyuli
 * Sign up & Sign in module
 * fancy1031@gmail.com
 *
 */
var express = require('express');
var ejwt = require('express-jwt');
var router = express.Router();
var jwt = require('jsonwebtoken');
var conn = require('../db-jeon');
var secretKey = require('./jwtKey');

console.log("./router/user/admin.js is loaded");

conn.getConnection(function(err){
    if(err){
        console.error('kids MySQL connection err');
        console.log(err);
    }
});

// POST
function post (req, res) {
    console.log("POST /user/admin is called");

    var admin = {
        'email': req.body.email,
        'passwd': req.body.passwd
    };

    var invaildValue = "";

    if (admin.email == null)
        invaildValue += "email ";
    if (admin.passwd == null)
        invaildValue += "passwd ";

    if (invaildValue) {
        var errorMessage = {
            'error': "Invaild_Value",
            'field': invaildValue
        }
        res.json(errorMessage);
        console.log("Error");
        console.log(errorMessage);
        return;
    }

    ///
    // PN 유효성 검사
    ///
    conn.query("INSERT INTO admin SET ?", admin,  function(err, result){
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
                'fk_admin' : result.insertId
            };

            var token = { 'Authorization': jwt.sign(payload, secretKey)};
            res.json(token);
        }
    });

};

// PUT
//삭제!!!!!
function put (req, res){
    console.log("PUT /user/kids is called");

    var value = {};
    var condition = "pk_admin = " + req.user.fk_admin;

    if(req.body.name)
        value.name = req.body.name;
    if(req.body.gender=='남' || req.body.gender=='여')
        value.gender = req.body.gender;
    if(req.body.age * 1)
        value.age = req.body.age;

    conn.query("UPDATE kids SET ? WHERE "+condition, value, function (err, result) {
        if(err) {
            console.log("Error : Cannot execute query");
            console.log(err);
            res.status(500).json({"error" : "Fail_query"});
        } else {
            res.status(200).send();
        }
    });

}


// DELETE
function remove (req, res){
    console.log("DELETE /user/kids.remove() is called");

    var condition = "pk_admin = " + req.user.fk_admin;

    conn.query("UPDATE kids SET ? WHERE "+condition, {'disable':1}, function (err, result) {
        if (err) {
            console.log("Error : Cannot disable kids");
            res.status(500).json({"error":"Fail_query"});
        }
        else if (result.changedRows === 0) {
            console.log("Error : Cannot disable kids (no target pk)");
            res.status(500).json({"error":"Invaild_number"});
        }
    });
    res.status(200).send();


}

function login (req, res) {
    console.log("POST /user/admin/login is called");

    var email = req.body.email;
    var passwd = req.body.passwd;

    var condition = "email='"+email+"' AND "+
        "passwd='"+passwd+"'";

    conn.query("SELECT pk_admin FROM admin WHERE "+condition, function(err, result) {
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
            var fk_admin = result[0].pk_admin;
            res.json( {'Authorization' : jwt.sign({'email':email, 'fk_parents':fk_admin}, secretKey) } );
            res.status(500).json();
        }
    });
}


router.get('/', function() {
    console.log("GET /user/kids is called");
});

// create
router.post('/', post);

// update
router.put('/', ejwt({secret: secretKey}), put);

// remove
router.delete('/', ejwt({secret: secretKey}), remove);

// login
router.post('/login', login);

module.exports = router;
