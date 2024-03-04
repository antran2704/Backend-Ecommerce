const express = require("express");
const router = express.Router();

const NotitficationController = require("../../controller/NotificationController");

router.post("/send", NotitficationController.sendNotifi);

module.exports = router;
