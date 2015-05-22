/* 
 * 2015.4.16
 * Create by kyuli
 * user router module
 * kyuli.yeo@gmail.com
 *
 */
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var secretKey = require('../jwtKey');
//including js file
var goal = require('../connectors/goal.js');
var saving = require('../connectors/saving.js');
var account = require('../connectors/account.js');
var push = require('../connectors/push.js');
var quest = require('../connectors/quest.js');
var quiz = require('../connectors/quiz.js');
//여기 왜 user 똑같아 ?
var user = require('./user');
var user = require('./user/index');

//QUIZ
router.post('/quiz', jwt({secret:secretKey}), quiz.createNowQuiz);
router.post('/quiz/admin', jwt({secret:secretKey}), quiz.createStdQuiz);
router.put('/quiz/admin/:pk_std_quiz',jwt({secret:secretKey}), quiz.updateQuiz);
router.delete('/quiz/admin/:pk_std_quiz', jwt({secret:secretKey}), quiz.removeStdQuiz);


//QUEST
router.post('/quest',jwt({secret:secretKey}), quest.createNowQuest);
router.post('/quest/parents/:fk_kids', jwt({secret:secretKey}), quest.createParents);
router.post('/quest/admin', quest.createAdmin);

router.put('/quest/parents/:pk_parents_quest', jwt({secret : secretKey}), quest.updateParentsQuest); //parents
router.put('/quest/admin/:pk_std_que', quest.updateStdQuest); //admin
router.put('/quest', jwt({secret:secretKey}), quest.updateQuestKids); //kids
router.put('/quest/stateUpdate/:fk_kids',jwt({secret:secretKey}), quest.updateQuestState);//update state call by parents

router.delete('/quest/parents/:pk_parents_quest', jwt({secret : secretKey}), quest.removeParentsQuest); //parents
router.delete('/quest/admin/:pk_std_que',quest.removeStdQuest);

//PUSH SERVER
router.post('/regist', jwt({secret:secretKey}), push.regist);
router.get('/getInfo/:pk_std_que/:pk_parents_quest/:pk_std_quiz', jwt({secret:secretKey}), push.pushQeustAndQuizInfoToApp); //조회할때 get 괜찮음.
router.get('/getQuestInfo/:fk_kids', jwt({secret:secretKey}), push.pushQuestState);//웹에서 검사받기 버튼 상태를 확인하기 위해서.

// GOAL
router.post('/goal', jwt({secret:secretKey}), goal.create);
router.get('/goal', jwt({secret : secretKey }), function(req, res){
	//자식의 자신 정보를 요청하는 경우
	if(req.user.fk_kids){
		console.log(req.user.fk_kids);
		goal.allGoal(req,res);
		return;
	}
	//부모가 잘못 요청한 경우
	if(req.user.fk_parents)
		res.status(500).json({"error" : "url"} ) ;
});
router.get('/goal/current', jwt({secret:secretKey}), function(req, res){
	//자식이 현재 진행중인 목표를 요청하는 경우
	if(req.user.fk_kids){
		goal.currentGoal(req, res);
		return;
	}
	if(req.user.fk_parents)
		res.status(500).json('error : url');
});
router.get('/goal/:fk_kids', jwt({secret : secretKey}), function(req, res){
	if(req.user.fk_kids){
		goal.allGoal(req, res);
		return;
	}
	//부모가 자식의 목표들을 요청하는 경우
	if(req.user.fk_parents){
		goal.allGoalParents(req, res);
		return;
	}
});
//router.get('/goal/current/:fk_kids', jwt({secret:secretKey}), goal.currentGoal);
router.get('/goal/current/:fk_kids', jwt({secret:secretKey}), function(req, res){
	if(req.user.fk_kids){
		goal.currentGoal(req, res);
		return;
	}
	//부모가 자식의 현재 수행하는 목표를 요청하느 ㄴ경우
	if(req.user.fk_parents){
		goal.currentGoalParents(req,res);
		return;
	}
});

router.put('/goal', jwt({secret:secretKey}), goal.update);
router.delete('/goal/:pk_goal', jwt({secret:secretKey}), goal.remove);
//SAVING_LIST
router.get('/saving', jwt({secret:secretKey}), saving.read);
router.get('/saving/:fk_kids', jwt({secret : secretKey }), saving.readParents);
/*
//ACCOUNT BOOK
router.get('/account', jwt({ secret : secretKey }), function(req,res){
	if(req.user.fk_kids){
		account.allAccount(req, res);
		return ;
	}
	if(req.user.fk_parents)
		res.status(500).json('error : url');
});
router.get('/account/:fk_kids', jwt({ secret : secretKey }), function(req, res){
	if(req.user.fk_kids){
		acccount.allAccount(req,res);
		return;
	}
	if(req.user.fk_parents){
		console.log('router parents!!');
		account.allAccountParents(req,res);
		return;
	}
});
*/
//jeon's router
router.use('/user', user);

module.exports = router;
