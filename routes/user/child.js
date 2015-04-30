/**
 * Created by jeon on 2015. 4. 15..
 */

var express = require('express');
var router = express.Router();
var conn = require('../db-jeon');

console.log("./router/user/child.js is loaded");

function post (req, res) {
    console.log("POST /user/parents/child is called");

    var pn = req.body.pn;
    var condition = "product_num = "+pn+" AND used=1";

    conn.query("SELECT fk_kids FROM product_num WHERE "+condition, function(err,result) {
        if(err){
            console.log("Error : Cannot execute query");
            console.log(err);
            console.log(this.sql);
            res.status(500).json({"error":"Fail_query"});
        }else if(result.length == 0) {
            res.status(500).json({"error": "Invaild_pn"});
        }else{
            var fk_kids = result[0].fk_kids;
            var fk_parents = req.user.fk_parents;

            condition = "fk_kids="+fk_kids+
            " AND fk_parents="+fk_parents;
            conn.query("SELECT * FROM parents_has_kids WHERE "+condition, function(err, result) {
                if(err){
                    console.log("Error : Cannot execute query");
                    console.log(err);
                    console.log(this.sql);
                    res.status(500).json({"error":"Fail_query"});
                }else if(result.length) {
                    console.log("Error : Already registered");
                    res.status(500).json({"error":"Already registered"});
                }else {
                    var value = {"fk_kids":fk_kids, "fk_parents":fk_parents};
                    var name;
                    conn.query("SELECT name FROM kids WHERE pk_kids="+fk_kids, function (err, result) {
                        if(err) {
                            console.log("Error : Cannot execute query");
                            console.log(err);
                            console.log(this.sql);
                            res.status(500).json({"error":"Fail_query"});
                        }else{
                            value.name = result[0].name;
			    conn.query("INSERT INTO parents_has_kids SET ?", value, function(err, result) {
                        	if(err) {
	                            console.log("Error : Cannot execute query");
        	                    console.log(err);
                	            console.log(this.sql);
                        	    res.status(500).json({"error":"Fail_query"});
                    	    }else{
				    console.log(this.sql);
	                            res.status(200).send(value);
        	            }
                   	    });
		        }
		    });
                }
            });
        }
    });
}

function get (req, res) {
    console.log("GET /user/parents/child is called");

    var fk_parents = req.user.fk_parents;
    var condition = "fk_parents= "+fk_parents;
    var value = {};

    conn.query("SELECT fk_kids, name FROM parents_has_kids WHERE "+condition, function(err, result) {
       if(err) {
           console.log("Error : Cannot execute query");
           console.log(err);
           console.log(this.sql);
           res.status(500).json({"error":"Fail_query"});
       } else {
/*
           value.child = new Array(value.length);
           for(var i=0 ; i<result.length ; i++)
           {
               value.child[i] = {};
               value.child[i].fk_kids = result[i].fk_kids;
               value.child[i].name = result[i].name;
           }

           res.status(200).json(value);
*/
	   res.status(200).json(result);
       }
    });
}

function getParams (req, res) {
    console.log("GET /user/parents/child/:fk_kids is called");

    var fk_kids = req.params.fk_kids;
    var fk_parents = req.user.fk_parents;
    var condition = "fk_parents=" + fk_parents + " AND fk_kids=" + fk_kids;

    conn.query("SELECT * FROM parents_has_kids WHERE " + condition, function (err, result) {
        if (err) {
            console.log("Error : Cannot execute query");
            console.log(err);
            console.log(this.sql);
            res.status(500).json({"error": "Fail_query"});
        } else if (result.length == 0) {
            console.log("Error : Not regstered");
            res.status(500).json({"error": "Invaild_number"});
        } else {
            conn.query("SELECT * FROM kids WHERE pk_kids="+fk_kids, function (err, result) {
                if(err) {
                    console.log("Error : Cannot execute query");
                    console.log(err);
                    console.log(this.sql);
                    res.status(500).json({"error": "Fail_query"});
                }
                else {
                    res.status(200).json(result[0]);
                }
            });
        }
    });
}

function remove (req, res) {
    console.log("DELETE /user/parents/child is called");

    var fk_parents = req.user.fk_parents;
    var fk_kids = req.body.fk_kids;
    var condition = "fk_parents="+fk_parents+" AND fk_kids="+fk_kids;

    conn.query("DELETE FROM parents_has_kids WHERE "+condition, function(err, result) {
        if (err) {
            console.log("Error : Cannot execute query");
            console.log(err);
            console.log(this.sql);
            res.status(500).json({"error": "Fail_query"});
        } else if (result.affectedRows == 0) {
            console.log("Error : No_kids");
            res.status(500).json({"error": "No_kids"});

        } else {
            res.status(200).json();
        }
    });
}


router.post('/', post);
router.get('/:fk_kids', getParams);
router.get('/', get);
router.delete('/', remove);



module.exports = router;
