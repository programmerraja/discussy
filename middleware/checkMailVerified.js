function checkMailVerified(req, res, next) {
    if (req.user.isEmailVerified) {
        next()
        return
    }
    // next()
    res.json({
        status: "failed",
        msg: "Please verify your mail"
    });
    return;
}

module.exports = checkMailVerified;