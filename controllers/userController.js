const db = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
var validator = require("validator");
const passport = require("passport");

const Util = require("../util/Util");

const User = {
  signIn:function (req, res,next ){
           return passport.authenticate("user_local",{session: false},
            (err, user, info) => {
                if (err || !user) {
                    return res.status(400).json({
                        status:"failed",
                        msg: info ? info.message : 'Login failed',
                    });
                } 
                req.login(user, {session: false}, (err) => {
                   if (err) {
                       res.status(500).json({status:"failed",msg:err});
                   }
                   //filtering user id and email for payload and setting exp time as 7 day
                   let payload=JSON.stringify({"id":user._id,username:user.name,"email":user.email, exp: Math.floor(Date.now() / 1000) + (60 * 60*24*7)});
                   // generate a signed json web token with the contents of user object and return it in the response
                   const token = jwt.sign(payload, process.env.JWT_KEY);
                   res.json({status:"sucess",token});
                });
            })  
      (req,res)
  },

  signUp:async function(req, res) {
    let {
        name,
        email,
        password,
    } = req.body;
    if (name && email && password ) {
        if (!validator.isEmail(email)) {
            res.json( {
                status:"failed",
                msg: "Invalid Email"
            });
            return
        }

        db.User.create({
            name,
            email,
            password
        })
        .then(async new_user => {
            if (new_user) {
              let link = req.protocol + "://" + req.get("host") + "/user/verifiy/email/" + new_user._id;
              let msg =await Util.verfiyMail(new_user.email, new_user.name, link);

              if (msg) {
                  res.json({"status":"sucess","msg":"Account created sucessfully"});
              } else {
                  //need to remove user from database  if mail not send sucessfully
                     db.User.deleteOne({
                          _id: new_user._id
                      })
                  
                  res.json({status:"failed",
                          msg: "Sorry Something went wrong. Please try again"
                  });
              }
            }
            else{
                res.json({status:"failed",
                            msg: "Sorry Something went wrong. Please try again"
                    });
            }
        })
        .catch(err=>{
          let msg=Util.dbErrorHandler(err)
          Util.logError(err.msg,err)
          res.json({status:"failed",msg: msg});
        })
    }
    else{
       res.json({status:"failed",msg: "Please enter all the detail's."}); 
    }
  },

  verifiyMyEmail:function(req,res) {
    db.User.findOneAndUpdate({_id:req.params.userId},{isEmailVerified:true})
    .then((user)=>{
      if(user){
        res.json({status:"sucess",msg:"email verified sucessfully"})
      }else{
        res.json({status:"sucess",msg:"email verified failed"})
      }
    })
    .catch(err=>{
          Util.logError(err.msg,err)
          res.json({status:"failed",
                            msg: "Sorry Something went wrong. Please try again"
                    });
    })
  },
  getMyProfile:function (req,res){
      res.json({
        status:"sucess",
        name: req.user.name
    });
  },
  
  updateMyProfile:async function(req,res){
      if (req.body.name && req.body.old_password) {
            let {
                name,
                old_password,
                new_password
            } = req.body;
            let user_id = req.user._id;
            let user = await db.User.findOne({
                _id: user_id
            });
            if (user) {
                if (user.checkPassword(old_password, user.password)) {
                    if (new_password) {
                        user.name = name;
                        user.password = new_password;
                    } else {
                        user.name = name;
                    }
                    user.save()
                    .then((user)=>{
                        if (user) {
                          res.json({
                              status:"sucess",
                              name: user.name,
                              msg: "sucessfully updated"
                          });
                        }
                        else {
                            res.json( {
                                status:"failed",
                                name: req.user.name,
                                msg: "Something went wrong"
                            });
                         }
                    })
                    .catch((err) => {
                        let msg = Util.dbErrorHandler(err)
                        Util.logError(err.msg,err)
                        res.json({
                            status:"failed",
                            name: req.user.name,
                            msg: msg
                        });
                    });
                    

                } else {
                    res.json( {
                        status:"failed",
                        name: req.user.name,
                        msg: "Password does not match"
                    });
                }
            }

        }
        else {
                    res.json( {
                        status:"failed",
                        name: req.user.name,
                        msg: "Password does not match"
                    });
        }
  },
  forgetMyPassword:async function (req, res) {
        if (req.body.email) {
            let email = req.body.email;
          try{
                var user = await db.User.findOne({
                    email: email
                });
                if (user) {
                    let token = Util.generateToken();
                    let link = req.protocol + "://" + req.get("host") + "/user/reset/password/" + token;

                    //we adding 20 mins to current date and converting in to mili sec
                    let password_reset_expires = Date.now() + 20 * 60 * 1000;
                    //updating the user token
                    let new_user = await db.User.findOneAndUpdate({
                        _id: user._id
                    }, {
                        passwordResetToken: token,
                        passwordResetExpires: password_reset_expires
                    });

                    //sending mail to user
                    let msg = await Util.sendPasswordReset(user.email, user.name, link);
                    //if msg send sucessfully 
                    if (msg) {
                        res.json({
                            status: "sucess",
                            msg: "Check your mail to reset the password"
                        });
                    } else {
                        res.json({
                            status: "failed",
                            msg: "Sorry Something went wrong. Please try again"
                        });
                    }
                    return
                }
                res.json({
                    status: "failed",
                    msg: "No user exit with given gmail"
                })
          }
          catch(e){
              Util.logError(err.msg,err);
              res.json({status: "failed",msg: "Sorry Something went wrong. Please try again"});
          }
        }
    },
    resetMyPassword:async function (req, res) {
        let password_reset_token = req.body.passwordId;
        let new_password = req.body.password;
        if (password_reset_token && new_password) {
            //finding the user
            var user = await db.User.findOne({
                passwordResetToken: password_reset_token,
                passwordResetExpires: {
                    $gt: Date.now()
                }
            });
            if (user) {
                let hash = bcrypt.hashSync(new_password, 10);
                let new_user = await db.User.findOneAndUpdate({
                    _id: user._id
                }, {
                    passwordResetToken:null,
                    password: hash
                });
                res.json({
                    status: "sucess",
                    msg: "Password Updated"
                });
            } else {
                res.json({
                    status: "failed",
                    msg: "Link Expires"
                });
            }
            return
        }
        res.status(400).json({
            status: "failed",
            msg: "Link not found"
        });
    },
    getMyQuestions:function(req,res){
        db.Question
        .find({userId:req.user._id})
        .then((questions_obj)=>{
           questions_obj.forEach(question=>{
             question._doc.user={name:req.user.name}
           })

           res.json({status:"sucess",questions:questions_obj});
        })
        .catch((err)=>{
          Util.logError(err.msg,err);
          res.json({status:"failed",msg:"Something went wrong"});
        })
    },
    getMySortedQuestions:function(req,res){
        if(req.query.sortBy && req.query.type){
          db.Question
            .find({userId:req.user._id})
            .sort({[req.query.sortBy]:parseInt(req.query.type)})

            .then((questions_obj)=>{
                questions_obj.forEach(question=>{
                 question._doc.user={name:req.user.name}
               })

               res.json({status:"sucess",questions:questions_obj});
            })
            .catch((err)=>{
              Util.logError(err.msg,err);
              res.json({status:"failed",msg:"Something went wrong"});
            })  
        }else{
              res.json({status:"failed",msg:"Query missing"});
        }
    },
    //single question for editing
    getMyQuestion:function(req,res){
        db.Question.findOne({userId:req.user._id,_id:req.params.questionId})
        .then((question_obj)=>{
              if(question_obj){
                res.json({status:"sucess",question:question_obj});
              }else{
               res.json({status:"failed",msg:"Something went wrong"});
              }
        })
        .catch((err)=>{
          Util.logError(err.msg,err);
          res.json({status:"failed",msg:"Something went wrong"});
        })
  },
  addMyQuestion:function (req,res){
      if(req.body.topics && req.body.question){
         db.Question
           .create({userId:req.user._id,topics:req.body.topics,desc:req.body.question})
           .then((question_obj)=>{
                res.json({status:"sucess",msg:"sucessfully added your question"})
            })
           .catch(err=>{
              logError(err.msg,err)
              res.json({status:"failed",msg: "Sorry Something went wrong. Please try again"});
            })
      }else{
        res.json({status:"failed",msg: "Please fill all the data"});
      }
  },
  updateMyQuestion:function (req,res){
      if(req.body.question_id && req.body.topics && req.body.question){
        db.Question
          .findOneAndUpdate({_id:req.body.question_id,userId:req.user._id,},{topics:req.body.topics,desc:req.body.question})
          .then((question_obj)=>{
                res.json({status:"sucess",msg:"sucessfully updated your question"})
          })
          .catch((err)=>{
            res.json({status:"failed",msg:"Something went wrong"});
          })
      }else{
            res.json({status:"failed",msg:"Please filled all things"});
      }
  },
  deleteMyQuestion:function(req,res) {
      if(req.params.questionId){
        db.Question
        .findOneAndRemove({_id:req.params.questionId})
        .then((question_obj)=>{
              res.json({status:"sucess",msg:"sucessfully deleted your question"})
              //also remove all the answer
              db.Answer
                .deleteMany({questionId:req.params.questionId})
                .then((answer_obj)=>{})
        })
        .catch((err)=>{
          Util.logError(err.msg,err);
          res.json({status:"failed",msg:"Something went wrong"});
        })  
      }else{
            res.json({status:"failed",msg:"questionId missing"});
      }
  },
  getMyAnswers:function(req,res){
        db.Answer
        .find({userId:req.user._id})
        .then((answers_obj)=>{
           answers_obj.forEach(answer=>{
             answer._doc.user={name:req.user.name}
           })
           res.json({status:"sucess",answers:answers_obj});
        })
        .catch((err)=>{
          Util.logError(err.msg,err);
          res.json({status:"failed",msg:"Something went wrong"});
        })
  },
  getMyAnswer:function(req,res){
    if(req.params.answerId){
        db.Answer.findOne({userId:req.user._id,_id:req.params.answerId})
        .then((answer_obj)=>{
              if(answer_obj){
                res.json({status:"sucess",answer:answer_obj});
              }else{
               res.json({status:"failed",msg:"Something went wrong"});
              }
        })
        .catch((err)=>{
          Util.logError(err.msg,err);
          res.json({status:"failed",msg:"Something went wrong"});
        })
    }else{
            res.json({status:"failed",msg:"answerId missing"});
    }
  },
  addMyAnswer:function (req,res){
      if(req.body.answer && req.body.question_id){
         
         db.Answer
           .create({userId:req.user._id,questionId:req.body.question_id,answer:req.body.answer})
           .then((answer_obj)=>{
              if(answer_obj){
                res.json({status:"sucess",answer:{...answer_obj._doc,user:{name:req.user.name}}})
              }else{
               res.json({status:"failed",msg: "Sorry Something went wrong. Please try again"});
              }
            })
           .catch(err=>{
              Util.logError(err.msg,err);
              res.json({status:"failed",msg: "Sorry Something went wrong. Please try again"});
            })
      }else{
        res.json({status:"failed",msg: "Please fill all the data"});
      }
  },
  updateMyAnswer:function (req,res){
      if(req.body.answer_id  && req.body.answer){
        db.Answer
          .findOneAndUpdate({_id:req.body.answer_id,userId:req.user._id,},{answer:req.body.answer})
          .then((answer_obj)=>{
              if(answer_obj){
                res.json({status:"sucess",msg:"sucessfully updated your answer"})
              }else{
                 res.json({status:"failed",msg:"Something went wrong"});
              }
          })
          .catch((err)=>{
            Util.logError(err.msg,err);
            res.json({status:"failed",msg:"Something went wrong"});
          })
      }else{
            res.json({status:"failed",msg:"Please filled all things"});
      }
  },
  deleteMyAnswer:function(req,res) {
      if(req.params.answerId){
        db.Answer
        .findOneAndRemove({_id:req.params.answerId})
        .then((answer_obj)=>{
              res.json({status:"sucess",msg:"sucessfully deleted your answer"})
        })
        .catch((err)=>{
          Util.logError(err.msg,err);
          res.json({status:"failed",msg:"Something went wrong"});
        })  
      }
  }, 
};

module.exports = User;
