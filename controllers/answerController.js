const mongoose = require("mongoose");

const db = require("../models");

const Util = require("../util/Util");

const Answer = {
  
  getAnswers:function(req,res){
    if(req.params.questionId){
      let user_lookup={from: "users",localField: "userId",foreignField: "_id",as: "user"}
      let answer_lookup={from: "answers",localField: "_id",foreignField:"questionId",as: "answers"}      
      
      db.Answer
        .aggregate([
            {$match:{questionId:mongoose.Types.ObjectId(req.params.questionId)}},
            {$lookup:user_lookup},
            {$unset:["user._id","user.email","user.isEmailVerified","user.password","user.createdAt","user.updatedAt"]},
          ])
        .then((answers)=>{
            if(answers){
              db.Question
                .aggregate([
                    {$match:{_id:mongoose.Types.ObjectId(req.params.questionId)}},
                    {$lookup:user_lookup},
                    {$unset:["user._id","user.email","user.isEmailVerified","user.password","user.createdAt","user.updatedAt"]},
                ])
                .then((question)=>{
                  //adding question to first one arr
                  let new_answers={"question":{...question[0],
                                             user:{_id:question[0]?.user[0]?._id,name:question[0]?.user[0]?.name}
                                            },
                                             answers:[]}
                  answers.forEach(ques=>{
                    new_answers.answers.push({...ques,user:{_id:ques.user[0]._id,name:ques.user[0].name}})
                  })

                  res.json({status:"sucess",answers:new_answers});
                })
                .catch((err)=>{
                  Util.logError(err.msg,err);
                  res.json({status:"failed",msg:"Something went wrong"});
                })  
            }else{
                  res.json({status:"failed",msg:"Something went wrong"});
            }
        })
        .catch((err)=>{
            Util.logError(err.msg,err);
            res.json({status:"failed",msg:"Something went wrong"});
        })  
    }else{
          res.json({status:"failed",msg:"questionId Params missing"});
    }
  },

  getSortedAnswer:function(req,res){
   if(req.params.questionId && req.query.sortBy && req.query.type){

      let user_lookup={from: "users",localField: "userId",foreignField: "_id",as: "user"}
      let answer_lookup={from: "answers",localField: "_id",foreignField:"questionId",as: "answers"}      
      db.Answer
        .aggregate([
            {$match:{questionId:mongoose.Types.ObjectId(req.params.questionId)}},
            {$lookup:user_lookup},
            {$unset:["user._id","user.email","user.isEmailVerified","user.password","user.createdAt","user.updatedAt"]},
            {$sort:{[req.query.sortBy]:parseInt(req.query.type)}}
          ])
        .then((answers)=>{
            if(answers){
                  let new_answers={answers:[]}
                  answers.forEach(ques=>{
                    new_answers.answers.push({...ques,user:{_id:ques.user[0]._id,name:ques.user[0].name}})
                  })
                  res.json({status:"sucess",answers:new_answers});
            }
        })
        .catch((err)=>{
          Util.logError(err.msg,err);
          res.json({status:"failed",msg:"Something went wrong"});
        })

      }else{
          res.json({status:"failed",msg:"Params missing"});
      }
  }

 
};

module.exports = Answer;
