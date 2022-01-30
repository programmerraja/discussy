const passport = require("passport");
const localStrategy = require("./localStrategy");
const jwtStrategy = require("./jwtStrategy");

const { User } = require("../models");

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
  done(null, user.id);
});
// user object attaches to the request as req.user
passport.deserializeUser((userID, done) => {
  User.findById(userID, (err, user) => {
    done(err, user);
  });
});
//  Use Strategies
//startegy for users
passport.use("user_local",localStrategy.userStrategy);
passport.use("user_jwt",jwtStrategy.userStrategy);
passport.use("user_check",jwtStrategy.userCheckStrategy);







module.exports = passport;
