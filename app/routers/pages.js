var express = require('express');
var router = express.Router();
var path = require('path');
var Promise = require('promise');
var Problems = require('../models/problem')
var Quiz = require('../models/quiz');

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
    var id = req.params.id;
    Quiz.findOne({'_id': id },function(err,quiz){
        if(err) console.log(err);
        else{
            Problems.find({'_id': {$in: quiz.problemsId}},function(err,problems){
                if(err)console.log(err);
                else{
                    res.render('quizDetail',{problems: problems, quiz: quiz});
                }
            })
        }
    })
})

module.exports = router;