var express = require('express');
var router = express.Router();
var path = require('path');
var Promise = require('promise');
var Problems = require('../models/problem');
var Quiz = require('../models/quiz');
var Participant = require('../models/participant');
var Topic = require('../models/topic');
var Session = require('../models/session');
var User = require('../models/user');
 
var auth = function(req,res,next){
    console.log('Cookie id :' + req.cookies.secret );
    Session.findOne({'secret':req.cookies.secret },function(err,result){
        if(err){
            console.log(err);
            res.sendStatus(401);
        }else{
            if(result){
                return next();
            }else{
                return res.redirect('/login');
            }
        }
    })
};

router.get('/staff',auth,function(req,res){
    res.render('staff');
})

router.get("/quizzes",auth,function(req,res){
    Quiz.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('quizzes',{data: result});
        }
    })
})
router.get('/questions',auth,function(req,res){
    Problems.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('questions',{data: result});
        }
    })
})
router.get('/topics',auth,function(req,res){
    Topic.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('topics',{data: result});
        }
    })
})

router.get('/createQuestion',auth,function(req,res){
    Topic.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('createQuestion',{data: result});
        }
    })
})
router.get('/createTopic',auth,function(req,res){
    res.render('createTopic');
})
router.get('/createQuiz',auth,function(req,res){
    res.render('createQuiz');
})

router.get('/question/edit/:id',auth,function(req,res){
    Problems.findOne({'_id':req.params.id},function(err,result){
        if(err){
            res.json({"error":true,"message":err});
        }else{
            Topic.find({},function(err,topics){
                if(err){
                    res.json({"error": true,"message":err});
                }else{
                    res.render('editQuestion',{data: result,topics : topics});
                }
            })
        }
    })
})

router.get('/topic/edit/:id',auth,function(req,res){
    Topic.findOne({'_id':req.params.id},function(err,result){
        if(err){
            res.json({"error":true,"message":err});
        }else{
            res.render('editTopic',{data: result})
        }
    })
})

router.get('/quiz/edit/:id',auth,function(req,res){
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

router.get('/quiz/addQuestion/:id',auth,function(req,res){
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

module.exports = router;