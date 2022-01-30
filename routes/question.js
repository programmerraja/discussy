const express = require("express");
const router = express.Router();

//controller
const questionController = require("../controllers/questionController.js");

//middleware
const Auth = require("../middleware/auth.js");

router.get("/getQuestions/",Auth.isAuthenticated(),
			questionController.getQuestions);

router.get("/getSortedQuestions/",Auth.isAuthenticated(),
			questionController.getSortedQuestions);


module.exports = router;
