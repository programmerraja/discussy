const express = require("express");
const router = express.Router();

//controller
const answerController = require("../controllers/answerController.js");

//middleware
const Auth = require("../middleware/auth.js");

router.get("/getAnswers/:questionId",Auth.isAuthenticated(),
			answerController.getAnswers);

router.get("/getSortedAnswers/:questionId/",Auth.isAuthenticated(),
			answerController.getSortedAnswer);

module.exports = router;
