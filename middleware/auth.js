const passport = require("../passport");


const Auth=
		{
			isAuthenticatedUser:function () {
				return passport.authenticate('user_jwt', { session: false })
			}
		}
module.exports = Auth;