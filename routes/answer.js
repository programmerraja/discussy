const express = require("express");
const router = express.Router();

//controller
const answerController = require("../controllers/answerController.js");

//middleware
const Auth = require("../middleware/auth.js");

router.get("/getAnswers/:questionId",
			answerController.getAnswers);

router.get("/answers/:questionId/",
			answerController.getSortedAnswer);

module.exports = router;
