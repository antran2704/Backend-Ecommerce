const express = require("express");
const router = express.Router();

router.get("/email", (req, res) => {
    res.render("email/newOrder");
})

module.exports = router;