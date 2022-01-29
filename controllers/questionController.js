const db = require("../models");

const Util = require("../util/Util");

const Question = { 

   getQuestions:function(req,res){
       let lookup={from: "users",localField:"userId",foreignField:"_id",as:"user"}
       db.Question
         .aggregate([
                        {$match:{}},
                        {$lookup:lookup},
                        {$unset:["user._id","user.email","user.isEmailVerified","user.password","user.createdAt","user.updatedAt"]}
                   ])
         .then((questions)=>{
            let new_questions=[]
            questions.forEach(ques=>{
              new_questions.push({...ques,user:{_id:ques.user[0]._id,name:ques.user[0].name}})
            })
             res.json({status:"sucess",questions:new_questions});
         
         })
         .catch((err)=>{
            Util.logError(err.msg,err);
            res.json({status:"failed",msg:"Something went wrong"});
         })
  },

  getSortedQuestions:function(req,res){
    if(req.query.sortBy && req.query.type){
      
      let lookup={from: "users",localField: "userId",foreignField: "_id",as: "user"}
      db.Question
        .aggregate([
                    {$match:{}},
                    {$lookup:lookup},
                    {$unset:["user._id","user.email","user.isEmailVerified","user.password","user.createdAt","user.updatedAt"]},
                    {$sort:{[req.query.sortBy]:parseInt(req.query.type)}}
                  ])
        .then((questions)=>{

          let new_questions=[]
          questions.forEach(ques=>{
            new_questions.push({...ques,user:{_id:ques.user[0]._id,name:ques.user[0].name}})
          })
          res.json({status:"sucess",questions:new_questions});
        
        })
        .catch((err)=>{
          Util.logError(err.msg,err);
          res.json({status:"failed",msg:"Something went wrong"});
        })  
    }else{
          res.json({status:"failed",msg:"Query missing"});
    }
  }
 
};

module.exports = Question;
