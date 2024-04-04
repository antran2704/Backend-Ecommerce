const { isValidObjectId } = require("mongoose");
const { NotificationItemAdmin } = require("../../models");
const { SOCKET_EVENT } = require("../../configs/socket");

class NotificationAdminServices {
  async getNotificationsWithPage(pageSize, currentPage, query = {}) {
    const notifications = await NotificationItemAdmin.find({ ...query })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean();

    return notifications;
  }

  async countNotifications(query = {}) {
    const count = await NotificationItemAdmin.count({ ...query }).lean();

    return count;
  }

  async countUnreadNotifications() {
    const count = await NotificationItemAdmin.find({ isReaded: false })
      .count()
      .lean();

    return count;
  }

  async createNotification(payload) {
    if (!payload) return null;

    const notification = await NotificationItemAdmin.create(payload);

    if (notification) {
      // send notification real-time
      socket.emit(SOCKET_EVENT.notification, notification);
    }

    return notification;
  }

  async updateNotification(notification_id, payload) {
    if (!notification_id || !isValidObjectId(notification_id)) return null;

    const notification = await NotificationItemAdmin.findByIdAndUpdate(
      { _id: notification_id },
      { $set: { ...payload } },
      { upsert: true, new: true }
    );

    return notification;
  }
}

module.exports = new NotificationAdminServices();
