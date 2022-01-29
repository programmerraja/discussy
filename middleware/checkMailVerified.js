function checkMailVerified(req, res, next) {
    if (req.user.isEmailVerified) {
        next()
        return
    }
    // next()
    res.json({
        status: "failed",
        msg: "Please verify your mail to add your review"
    });
    return;
}

module.exports = checkMailVerified;