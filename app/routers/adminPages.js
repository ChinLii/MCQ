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
router.get('/ratioCorrectAndIncorrect',auth,async function(req,res){
    var totalCorrect = 0
    var totalTaken = 0
    await Problems.find({},function(err,result){
        if(err){
            console.log(err);
        }else{
            for(let i=0; i<result.length; i++){
               
                totalCorrect += result[i].numberOfCorrect
                totalTaken += result[i].numberOfTaken
              
            }
        }
    })
    percentageCorrect = ((totalCorrect/totalTaken)* 100).toFixed(2);
    console.log(percentageCorrect)
    res.render("admin/visualization_1",{percentageCorrect:percentageCorrect});
})

router.get('/percentageByTopic',auth,async function(req,res){
    var listTopics = []
    var problemList = []
    var topicPercentage = []
    await Topic.find({},function(err,result){
        if(err)console.log(err)
        for(let i = 0;i<result.length;i++){
            listTopics.push(result[i].title)
        }
    })
    for (let i =0; i < listTopics.length ; i++){
        await Problems.find({'topics': listTopics[i]},function(err,problems){
            problemList.push(problems)
        })
    }
    for(let i = 0; i < problemList.length ; i++){
        var sumCorrect = 0
        var sumTaken = 0;
        for(let j =0;j < problemList[i].length ; j++){
            sumCorrect += problemList[i][j].numberOfCorrect 
            sumTaken += problemList[i][j].numberOfTaken 
           
        } 
        if(sumTaken === 0){
            topicPercentage.push(0)
        }else{
            topicPercentage.push(((sumCorrect/sumTaken)* 100).toFixed(2))
        }
    }
    res.render("admin/visualization_2",{listTopics: listTopics,topicPercentage: topicPercentage})

})
router.get('/numberParticipant',auth,async function(req,res){
    var listTopics = []
    var problemList = []
    var listNumberOfTaken = []
    await Topic.find({},function(err,result){
        if(err)console.log(err)
        for(let i = 0;i<result.length;i++){
            listTopics.push(result[i].title)
        }
    })
    for (let i =0; i < listTopics.length ; i++){
        await Problems.find({'topics': listTopics[i]},function(err,problems){
            problemList.push(problems)
        })
    }
    for(let i = 0; i < problemList.length ; i++){
        var sumTaken = 0;
        for(let j =0;j < problemList[i].length ; j++){
            sumTaken += problemList[i][j].numberOfTaken 
        }
        listNumberOfTaken.push(sumTaken)
    }
    res.render("admin/visualization_3",{listTopics:listTopics,listNumberOfTaken:listNumberOfTaken})
})


module.exports = router;