var express = require('express');
var router = express.Router();
var path = require('path');
var Promise = require('promise');
var Problems = require('../models/problem');
var Quiz = require('../models/quiz');
var Participant = require('../models/participant');
var Topic = require('../models/topic');
router.get('/',function(req,res){
    Quiz.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('home',{data:result });
        }
    })
})
router.get('/staff',function(req,res){
    res.render('staff');
})
router.get("/quizzes",function(req,res){
    Quiz.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('quizzes',{data: result});
        }
    })
})
router.get('/questions',function(req,res){
    Problems.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('questions',{data: result});
        }
    })
})
router.get('/topics',function(req,res){
    Topic.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('topics',{data: result});
        }
    })
})
router.get('/createQuestion',function(req,res){
    res.render('createQuestion');
})
router.get('/createTopic',function(req,res){
    res.render('createTopic');
})
router.get('/createQuiz',function(req,res){
    res.render('createQuiz');
})

router.get('/question/edit/:id',function(req,res){
    Problems.findOne({'_id':req.params.id},function(err,result){
        if(err){
            res.json({"error":true,"message":err});
        }else{
            res.render('editQuestion',{data: result});
        }
    })
})

router.get('/topic/edit/:id',function(req,res){
    Topic.findOne({'_id':req.params.id},function(err,result){
        if(err){
            res.json({"error":true,"message":err});
        }else{
            res.render('editTopic',{data: result})
        }
    })
})

router.get('/quiz/edit/:id',function(req,res){
    Quiz.findOne({'_id':req.params.id},function(err,result){
        if(err){
            res.json({"error":true,"message":err});
        }else{
            //problem in quiz
            Problems.find({'_id': {$in: result.problemsId}},function(err,result1){
                if(err){
                    console.log(err);
                }else{
                    res.render('editQuiz',{data: result, problems : result1 });
                }
            })
        }
    })
});

router.get('/quiz/addQuestion/:id',function(req,res){
    var id = req.params.id;
    Quiz.findOne({'_id': id},function(err,quiz){
        if(err){
            console.log(err);
        }else{            
            Problems.find({'_id': {"$nin": quiz.problemsId}},function(err,result){
                if(err){
                    console.log(err);
                }else{
                    res.render("addQuestion",{data: result,id : id});
                }
            })
        }
    })
})
router.get('/quiz/do/:id',function(req,res){
    req.session.questionList = null;
    req.session.currentQuestion = null;
    req.session.maxQuestion = null;
    req.session.answerList = null;
    req.session.quiz = null;
    var id = req.params.id;
    req.session.questionList = [];
    req.session.answerList = [];
    Quiz.findOne({'_id': id },function(err,quiz){
        if(err) console.log(err);
        else{
            req.session.quiz = quiz._id;
            Problems.find({'_id': {$in: quiz.problemsId}},function(err,problems){
                if(err)console.log(err);
                else{
                    req.session.currentQuestion = 1;
                    req.session.maxQuestion = problems.length;

                    for(var i=0;i< problems.length;i++){
                        req.session.questionList.push(problems[i]._id);
                    }
                    res.render('quizDetail',{problems: problems, quiz: quiz, currentQuestion: req.session.currentQuestion});
                }
            })
        }
    })
})

router.get('/question/do/:id',function(req,res){
    var currentQuestion = req.session.currentQuestion;
    var maxQuestion =  req.session.maxQuestion;
    var id = req.params.id;
    Problems.findOne({'_id':id},function(err,result){
        if(err) console.log(err);
        else{
            res.render('takeQuestion',{data : result, maxQuestion : maxQuestion, currentQuestion: currentQuestion});
        }
    })

})
router.get("/result/:id",function(req,res){
    req.session.userAnswer = null;
    req.session.currentQuestion = null;
    req.session.questionList = null;
    var participantID = req.params.id;
    req.session.currentQuestion = 0;
    req.session.userAnswer = [];
    req.session.questionList = [];
    Participant.findOne({'_id': participantID},function(err,result){
        if(err)console.log(err)
        else{
            req.session.userAnswer = result.answerList;
            Quiz.findOne({'_id':result.quizId },function(err,quiz){
                if(err)console.log(err);
                else{
                    Problems.find({ '_id': { $in: quiz.problemsId } }, function (err, problems) {
                        if (err) console.log(err);
                        else {
                            for(var i=0;i< problems.length;i++){
                                req.session.questionList.push(problems[i]._id);
                            }
                            res.render('result',{quiz:quiz,problems:problems,result: result,currentQuestion : req.session.currentQuestion})
                        }
                    })
                }
            })
        }
    })
})

router.get('/show/:id/',function(req,res){
    var questionId = req.params.id;
    Problems.findOne({'_id':questionId},function(err,result){
        if(err)console.log(err);
        else{
            res.render("showAnswer",{data: result,currentQuestion: req.session.currentQuestion, userAnswer: req.session.userAnswer,maxQuestion: req.session.maxQuestion});
        }
    })

})

module.exports = router;