var express = require('express');
var router = express.Router();
var path = require('path');
var Problems = require('../models/problem')

router.get("/",function(req,res){
    //pass the list of quiz to this page 
    //query the quiz from mongodb
    res.render('home');
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

module.exports = router;