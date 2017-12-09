/*
Web service for this application 
*/
var express = require('express');
var router = express.Router();
var path = require('path');
var uuid = require('uuid');
var Problem = require('../models/problem');
var Quiz = require('../models/quiz');
var Participant = require('../models/participant');
var Topic = require('../models/topic');
var User = require('../models/user');
var Session = require('../models/session');

//sign up admin
//encapsulate from user
/*router.post('/signup',function(req,res){
    var newUser = new User();
    newUser.username = req.body.username;
    newUser.password = newUser.generateHash(req.body.password);
    newUser.save(function(err){
        if(err){console.log(err)}
        else{
            res.json({"message": "Create account !!!! "});
        }
    })
})*/

//login function 
router.post('/login',function(req,res){
    var session = new Session();
    User.findOne({ 'username': req.body.username }, function (err, user) {
        if (err) {
            console.log(err);
            res.json({ error: true, message: err });
        } else {
            //user not found!
            if (user === null) {
                res.cookie('success', false, { expires: new Date(new Date().getTime() + 60000) });
                console.log('Authentication failed; email or password is incorrect. Try again.');
                res.redirect('/login');

            }
            //user found!
            else {
                if (!user.validPassword(req.body.password)) {
                    res.cookie('success', false, { expires: new Date(new Date().getTime() + 60000) });
                    console.log('Authentication failed; email or password is incorrect. Try again.')
                    res.redirect('/login');

                }
                else {
                    var secret = uuid.v4();
                    session.secret = secret;
                    session.username = user.username;
                    session.save(function (err) {
                        if (err) {
                            console.log(err);
                            res.end(err);
                        } else {
                            console.log("Login successfully");
                            res.cookie('secret', secret, { expires: new Date(new Date().getTime() + 1296000000) });
                            res.clearCookie("success");
                            res.redirect('/admin/staff');

                        }
                    });
                }
            }
        }
    })
})
//logout function
router.get('/logout', function (req, res) {
    Session.remove({ 'secret': req.cookies.secret }, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.clearCookie("success");
            res.clearCookie("secret");
            res.redirect('/login');
        }
    });
});

//create question
router.post('/createQuestion', function (req, res) {
    var newProblem = new Problem();
    newProblem.question = req.body.question;
    newProblem.correctAnswer = req.body.correctAnswer;
    newProblem.choices = req.body.choices;
    newProblem.topics = req.body.topics;
    newProblem.save(function (err, problem) {
        if (err) {
            res.json(err);
        } else {
            res.json({ "message": "Create question completely" });
        }
    })
})

//Edit question 
router.post('/editQuestion', function (req, res) {
    Problem.update({ '_id': req.body.id }, { $set: { 'question': req.body.question, 'choices': req.body.choices, 'correctAnswer': req.body.correctAnswer ,'topics':req.body.topics}}, function (err, result) {
        if (err) console.log(err);
        else {
            res.json({ "message": "Already finished!" });
        }
    })
})

//Delete question
router.post('/deleteQuestion', function (req, res) {
    Quiz.find({ 'problemsId': req.body.id }, function (err, result) {
        if (err) {
            console.log(err);
        } else {
            for (var i = 0; i < result.length; i++) {
                result[i].problemsId.pull(req.body.id)
                result[i].save(function (err) {
                    if (err) console.log(err);
                })
            }

        }
    })
    Problem.remove({ '_id': req.body.id }, function (err) {
        if (err) {
            console.log(err);
        } else {

            res.json({ "message": "Already deleted! " });
        }
    })
})

//Create quiz
router.post('/createQuiz', function (req, res) {
    var newQuiz = new Quiz();
    newQuiz.title = req.body.title;
    newQuiz.save(function (err) {
        if (err) {
            res.json(err);
        } else {
            res.json({ "message": "Already created quiz" });
        }
    })
})

//Edit quiz
router.post('/editQuiz', function (req, res) {
    Quiz.update({ '_id': req.body.id }, { $set: { 'title': req.body.title } }, function (err, result) {
        if (err) console.log(err);
        else {
            res.json({ "message": "Already finished!" });
        }
    })
})

//Delete Quiz
router.post('/deleteQuiz', function (req, res) {
    console.log("delete quiz")
    Quiz.remove({ '_id': req.body.quizId }, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.json({ "error": false, "message": "Already deleted! " });
        }
    })
})

//Create topic
router.post('/createTopic',function(req,res){
    var topic = new Topic();
    topic.title = req.body.title;
    topic.save(function(err){
        if(err){
            res.json(err)
        }else{
            res.json({"message":"Already create topic"});
        }
    })
})

//Edit topic
router.post("/editTopic",function(req,res){
    Topic.update({ '_id': req.body.id }, { $set: { 'title': req.body.title } }, function (err, result) {
        if (err) console.log(err);
        else {
            res.json({ "message": "Already finished!" });
        }
    })
})
//Remove topic
router.post('/deleteTopic',function(req,res){
    Topic.remove({'_id':req.body.id},function(err){
        if(err){
            console.log(err);
        }else{
            res.json({"error": false,"message":"Already deleted! "});
        }
    })
})

//Remove question
router.post("/removeQuestion", function (req, res) {
    var id = req.body.id;
    var quizId = req.body.quizId;
    Quiz.findOne({ '_id': quizId }, function (err, quiz) {
        if (err) {
            res.json({ "error": true });
        } else {
            //remove question
            quiz.problemsId.pull(id);
            quiz.save(function (err) {
                if (err) {
                    res.json({ "error": true });
                } else {
                    res.json({ "error": false });
                }
            })
        }
    })
})

//add question to quiz
router.post("/addQuestion", function (req, res) {
    var quizId = req.body.quizId;
    Quiz.findOne({ '_id': quizId }, function (err, quiz) {
        if (err) {
            res.json({ "error": true });
        } else {
            //add question
            quiz.problemsId.push(req.body.id);
            quiz.save(function (err) {
                if (err) {
                    res.json({ "error": true });
                } else {
                    res.json({ "error": false });
                }
            })
        }
    })
})

//update current question 
router.post("/nextQuestion", function (req, res) {
    req.session.currentQuestion++;
    req.session.answerList.push(req.body.answer);
    var current = req.session.currentQuestion - 1;
    var questionID = req.session.questionList[current]
    res.json({ "nextQuestionID": questionID });

})

//update current show result 
router.post("/nextResult",function(req,res){
    req.session.currentQuestion = req.body.currentQuestion;
    var questionID = req.session.questionList[req.session.currentQuestion];
    res.json({"nextQuestionID":questionID});
})

//submit the quiz
router.post('/submit',async function (req, res) {
    var score = 0;
    var maxScore = req.session.maxQuestion;
    var userAnswers = req.session.answerList;
    req.session.answerList.push(req.body.answer);
    var thisQuiz;
    var listProblems;
    var newParticipant = new Participant();
    await Quiz.findOne({ '_id': req.session.quiz }, function (err, quiz) {
        if (err) console.log(err);
        else {
            thisQuiz = quiz;
        }
    })
    await Problem.find({ '_id': { $in: thisQuiz.problemsId } }, function (err, problems) {
        if (err) console.log(err);
        else {
            listProblems = problems;
            for (var i = 0; i < problems.length; i++) {
                if (userAnswers[i] === problems[i].correctAnswer) {
                    problems[i].numberOfCorrect += 1
                    problems[i].numberOfTaken += 1
                    problems[i].save(function(err){
                        if(err)console.log(err);
                    })
                    score ++;
                }else{
                    problems[i].numberOfTaken += 1;
                    problems[i].save(function(err){
                        if(err)console.log(err);
                    })
                }
            }
        }
    })
    newParticipant.quizId = thisQuiz._id;
    newParticipant.answerList = userAnswers;
    newParticipant.score = score;
    newParticipant.save(function(err,result){
        if(err) res.json({"error":true})
        else{
            res.json({"error": false,"participant": result._id});
        }
    })
})
module.exports = router;