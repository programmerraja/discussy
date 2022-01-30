const db = require("../models");
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require("dotenv").config();

const userStrategy = new JWTstrategy(
    {
      secretOrKey:process.env.JWT_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async function(token, done){
            try {
                db.User.findOne({_id:token.id}, (err, user) => 
                {
                if (err) {
                  return done(err);
                }
                if (!user) {
                  return done(null, false, { message: "Incorrect username" });
                }
                  return done(null,user); 
                });
            }
            catch (error) {
                done(error);
            }
      }
    );

const userCheckStrategy = new JWTstrategy(
    {
      secretOrKey:process.env.JWT_KEY,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    },
    async function(token, done){
            try {
                if(token && token.id){
                    db.User.findOne({_id:token.id}, (err, user) => 
                    {
                      if (err) {
                        return done(err);
                      }
                        return done(null,user); 
                    });
                }else{
                  done(null,{});
                }
            }
            catch (error) {
                done(null,{});
            }
      }
    );


strategy={userStrategy,userCheckStrategy};
module.exports = strategy;

