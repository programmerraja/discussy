const router = require("express").Router();

const users = require("./users");
const question = require("./question");
const answer = require("./answer");

router.use("/user", users);
router.use("/", question);
router.use("/",answer);


module.exports = router;
