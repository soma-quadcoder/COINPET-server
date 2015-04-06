//여기서 확인!!!
var express = require('express');
var router = express.Router();
var goal = require('../connectors/goal.js');

// goal!
router.post('/goal', goal.create);
router.get('/goal', goal.read);
router.put('/goal', goal.update);
router.delete('/goal', goal.remove);


module.exports = router;
