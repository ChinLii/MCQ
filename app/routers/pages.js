var express = require('express');
var router = express.Router();
var path = require('path');
var Promise = require('promise');
var Problems = require('../models/problem')
var Quiz = require('../models/quiz');

router.get('/',function(req,res){
    /*Quiz.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('home',{data:result });
        }
    })*/
    res.render('home');
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
            //problem in quiz
            Problems.find({'quizId': result._id},function(err,result1){
                if(err){
                    console.log(err);
                }else{
                    console.log(result1);
                    res.render('editQuiz',{data: result, problems : result1 });
                }
            })
        }
    })
});

router.get('/quiz/addQuestion/:id',function(req,res){
    var id = req.params.id;
    Problems.find({'quizId': {$ne: id}},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render("addQuestion",{data: result,id : id});
        }
    })
})

/*
find problem which is not contain the quiz id 
 Problems.find({'_id': {$ne: result._id}},function(err,result2){
                        if(err){
                            console.log(err);
                        }else{
                        }
 })

*/

module.exports = router;