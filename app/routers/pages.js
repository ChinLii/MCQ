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

router.get('/login',function(req,res){
    res.render('admin/login');
})

module.exports = router;