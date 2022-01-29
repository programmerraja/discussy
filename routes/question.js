const express = require("express");
const router = express.Router();

const questionController = require("../controllers/questionController.js");

const Auth = require("../middleware/auth.js");

router.get("/getQuestions/",
			questionController.getQuestions);

router.get("/questions/",
			questionController.getSortedQuestions);


module.exports = router;
