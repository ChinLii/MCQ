var express = require('express');
var router = express.Router();
var path = require('path');
var Problems = require('../models/problem')
var Quiz = require('../models/quiz');

router.get("/",function(req,res){
    Quiz.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('home',{data: result});
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
router.get('/createQuestion',function(req,res){
    res.render('createQuestion');
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

router.get('/quiz/edit/:id',function(req,res){
    Quiz.findOne({'_id':req.params.id},function(err,result){
        if(err){
            res.json({"error":true,"message":err});
        }else{
            res.render('editQuiz',{data: result});
        }
    })
});

module.exports = router;