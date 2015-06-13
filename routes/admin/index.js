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
var secretKey = require('../user/jwtKey');
var adminPasswd = require('./adminPasswd');

console.log("./router/admin/index.js is loaded");

conn.getConnection(function(err){
    if(err){
        console.error('admin MySQL connection err');
        console.log(err);
    }
});

// nothing
router.get('/', ejwt({secret: secretKey}), function() {
    console.log("GET /admin is called");
});

// login
router.post('/', function(req, res) {
    console.log("POST /admin is called");

    var adminInput = {
        'name': req.body.name,
        'passwd': req.body.passwd
    };

    if( !(adminInput.name && adminInput.passwd) )
    {
        console.log('input in null');
        res.status(500).send();
    }
    else if(adminInput.name == adminPasswd.name
            && adminInput.passwd == adminPasswd.passwd)
    {
        console.log('admin login');

        var payload = {
            'admin' : true,
            'fk_admin' : 1,
            'name' : adminInput.name,
        };

        var token = { 'Authorization': jwt.sign(payload, secretKey)};
        res.json(token);
    }
    else
    {
        console.log('login fail');
        res.status(500).send();
    }
    return;
});

module.exports = router;
