var express = require('express');
var router = express.Router();
var goal = require('../connectors/goal.js');
var pocket = require('../connectors/pocket.js');
var coin = require('../connectors/coin.js');
var jwt = require('express-jwt');
var secretKey = require('../connectors/user/jwtKey');

// goal!
router.post('/goal', goal.create);
router.get('/goal', goal.read);
router.get('/goal/:pk_goal', goal.read);
router.patch('/goal', goal.update);
router.delete('/goal', goal.remove);
//pocket!
router.post('/pocket', pocket.create);
router.get('/pocket',pocket.read);
router.patch('/pocket', pocket.update);
router.delete('/pocket', pocket.remove);


//coin - test
router.post('/coin', coin.create);
router.get('/coin', coin.read);
router.put('/coin', coin.update);
router.delete('/coin', coin.remove);

module.exports = router;
