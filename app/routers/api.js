var express = require('express');
var router = express.Router();
var path = require('path');
var Problem = require('../models/problem');
var Quiz = require('../models/quiz');

router.post('/createQuestion',function(req,res){
    var newProblem = new Problem();
    newProblem.question = req.body.question;
    newProblem.correctAnswer = req.body.correctAnswer;
    newProblem.choices = req.body.choices;
    newProblem.save(function(err,problem){
        if(err){
            res.json(err);
        }else{
           res.json({"message":"Create question completely"});
        }
    })
})

router.post('/editQuestion/',function(req,res){
    Problem.findOne({'id':req.body.id},function(err,result){
        if(err){
            console.log(err);
        }else{ 
            if(result != null){
                result.question = req.body.question;
                result.choices = req.body.choices;
                result.correctAnswer = req.body.correctAnswer;
                result.save(function(err){
                    if(err){
                        console.log(err);
                    }else{
                        res.json({"message":"Already finished!"});
                    }
                })
            }
        }
    })
})

router.post('/deleteQuestion',function(req,res){
    Problem.remove({'_id':req.body.id},function(err){
        if(err){
            console.log(err);
        }else{
            res.json({"message":"Already deleted! "});
        }
    })
})

router.post('/createQuiz',function(req,res){
    var newQuiz = new Quiz();
    newQuiz.title = req.body.title;
    newQuiz.save(function(err){
        if(err){
            res.json(err);
        }else{
            res.json({"message":"Already created quiz"});
        }
    })
})
module.exports = router;