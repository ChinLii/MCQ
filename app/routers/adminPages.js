/*
Page render for Admin

*/
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
 

//authentication checked 
var auth = function(req,res,next){
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

//render staff page
router.get('/staff',auth,function(req,res){
    res.render('admin/staff');
})

//render the list of quizzes page
router.get("/quizzes",auth,function(req,res){
    Quiz.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('admin/quizzes',{data: result});
        }
    })
})

//render the list of questions page
router.get('/questions',auth,function(req,res){
    Problems.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('admin/questions',{data: result});
        }
    })
})

//render the list of topics page
router.get('/topics',auth,function(req,res){
    Topic.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('admin/topics',{data: result});
        }
    })
})

//render create question page
router.get('/createQuestion',auth,function(req,res){
    Topic.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            res.render('admin/createQuestion',{data: result});
        }
    })
})

//render the create topic page
router.get('/createTopic',auth,function(req,res){
    res.render('admin/createTopic');
})

//render the create quiz page
router.get('/createQuiz',auth,function(req,res){
    res.render('admin/createQuiz');
})

//render edit question page by id 
router.get('/question/edit/:id',auth,function(req,res){
    Problems.findOne({'_id':req.params.id},function(err,result){
        if(err){
            res.json({"error":true,"message":err});
        }else{
            Topic.find({},function(err,topics){
                if(err){
                    res.json({"error": true,"message":err});
                }else{
                    res.render('admin/editQuestion',{data: result,topics : topics});
                }
            })
        }
    })
})

//render edit topic page by id
router.get('/topic/edit/:id',auth,function(req,res){
    Topic.findOne({'_id':req.params.id},function(err,result){
        if(err){
            res.json({"error":true,"message":err});
        }else{
            res.render('admin/editTopic',{data: result})
        }
    })
})

//render edit quiz page by id
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
                    res.render('admin/editQuiz',{data: result, problems : result1 });
                }
            })
        }
    })
});

//render quiz adding question page by id
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
                    res.render("admin/addQuestion",{data: result,id : id});
                }
            })
        }
    })
})

//render the visualization page 
router.get('/analysisData',auth,async function(req,res){
    var listCorrect = [];
    var listTaken = [];
    var listTitle = [];
    await Problems.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            for(var i=0; i<result.length; i++){
                listTitle.push(result[i]._id);
                listTaken.push(result[i].numberOfTaken);
                listCorrect.push(result[i].numberOfCorrect);
            }
           
        }
    })
    res.render("admin/visualization",{listTitle: listTitle, listTaken:listTaken, listCorrect: listCorrect});
})
module.exports = router;