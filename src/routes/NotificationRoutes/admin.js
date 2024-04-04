const express = require("express");
const router = express.Router();

const {
  NotificationAdminController,
} = require("../../controller/NotificationController");

router.post("/send", NotificationAdminController.sendNotifi);

router.patch(
  "/:notification_id",
  NotificationAdminController.updateNotification
);

router.post("/", NotificationAdminController.createNofication);

router.get("/home", NotificationAdminController.getNotifications);

router.get("/", NotificationAdminController.getNotificationsWithPage);

module.exports = router;
