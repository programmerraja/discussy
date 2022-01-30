const jwt = require('jsonwebtoken');

const passport = require("../passport");
const db = require("../models");


const Auth=
		{
			isAuthenticatedUser:function () {
				return passport.authenticate('user_jwt', { session: false })
			},
			isAuthenticated:function () {
				return (req,res,next)=>{
					try{
						let token=req.headers["authorization"]
						if(token){
							token=token.split("Bearer ")[1]
							if(token){
								user=jwt.verify(token,process.env.JWT_KEY)
								if(user){
									req.user=user;
								}
							}
						}
					}catch{}
					if(!req.user){
						req.user={}
					}
					next()
				}
			}
		}
module.exports = Auth;