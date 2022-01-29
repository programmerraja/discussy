const db = require("../models");
const LocalStrategy = require("passport-local").Strategy;

const userStrategy = new LocalStrategy(
  {
    usernameField: "email", // not necessary, DEFAULT
  },
  function (email, password, done) {
    db.User.findOne({ email: email}, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Email Does Not Exist" });
      }
      if (!user.checkPassword(password)) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    });
  }
);


strategy={userStrategy};

module.exports = strategy;
