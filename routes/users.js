const express = require("express");
const router = express.Router();

//controller
const userController = require("../controllers/userController.js");

//middleware
const Auth = require("../middleware/auth.js");
const checkMailVerified = require("../middleware/checkMailVerified.js");

//user routes
router.post("/signin",
			userController.signIn);

router.post("/signup",
			userController.signUp);

router.get("/verifiyMyEmail/:userId",
			userController.verifiyMyEmail);

router.get("/getMyProfile",
			Auth.isAuthenticatedUser(),
			userController.getMyProfile);

router.post("/updateMyProfile",
			Auth.isAuthenticatedUser(),
			userController.updateMyProfile);

router.post("/forgetMyPassword",
			userController.forgetMyPassword);

router.post("/resetMyPassword",
			userController.resetMyPassword);

//user question routes
router.get("/getMyQuestions",
			Auth.isAuthenticatedUser(),
			userController.getMyQuestions);

router.get("/getMyQuestion/:questionId",
			Auth.isAuthenticatedUser(),
			userController.getMyQuestion);

router.post("/addMyQuestion",
			Auth.isAuthenticatedUser(),
			checkMailVerified,
			userController.addMyQuestion);

router.post("/updateMyQuestion",
			Auth.isAuthenticatedUser(),
			checkMailVerified,
			userController.updateMyQuestion);

router.get("/deleteMyQuestion/:questionId/",
			userController.deleteMyQuestion);

//user answer routes
router.get("/getMyAnswers",
			Auth.isAuthenticatedUser(),
			userController.getMyAnswers);

router.get("/getMyAnswer/:answerId",
			Auth.isAuthenticatedUser(),
			userController.getMyAnswer);

router.post("/addMyAnswer",
			Auth.isAuthenticatedUser(),
			checkMailVerified,
			userController.addMyAnswer);

router.post("/updateMyAnswer",
			Auth.isAuthenticatedUser(),
			userController.updateMyAnswer);

router.get("/deleteMyAnswer/:answerId/",
			Auth.isAuthenticatedUser(),
			userController.deleteMyAnswer);

module.exports = router;
