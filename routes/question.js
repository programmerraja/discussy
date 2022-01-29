const express = require("express");
const router = express.Router();

//controller
const questionController = require("../controllers/questionController.js");

//middleware
const Auth = require("../middleware/auth.js");

router.get("/getQuestions/",
			questionController.getQuestions);

router.get("/getSortedQuestions/",
			questionController.getSortedQuestions);


module.exports = router;
