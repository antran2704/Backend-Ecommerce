const { isValidObjectId } = require("mongoose");
const {
  CreatedResponse,
  GetResponse,
} = require("../../helpers/successResponse");
const { NotificationAdminServices } = require("../../services");
const { BadResquestError } = require("../../helpers/errorResponse");

const {
  handleCheckQuery,
  handleParseQuery,
} = require("../../helpers/queryParse");

const NotificationController = {
  sendNotifi(req, res) {
    const { content } = req.body;

    socket.emit("notification", content);

    return new CreatedResponse().send(res);
  },
  async getNotifications(req, res) {
    const query = req.query;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 6;

    const notifications =
      await NotificationAdminServices.getNotificationsWithPage(limit, page);

    const total = await NotificationAdminServices.countNotifications();
    const totalUnread =
      await NotificationAdminServices.countUnreadNotifications();

    const payload = {
      notifications,
      total,
      totalUnread,
    };

    return new GetResponse(200, payload).send(res);
  },
  async getNotificationsWithPage(req, res) {
    const query = req.query;

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 6;

    const parseQuery = handleParseQuery(handleCheckQuery(query));

    const notifications =
      await NotificationAdminServices.getNotificationsWithPage(
        limit,
        page,
        parseQuery
      );

    const total = await NotificationAdminServices.countNotifications(
      parseQuery
    );

    return new GetResponse(200, notifications).send(res, {
      pagination: {
        totalItems: total,
        currentPage: page,
        pageSize: limit,
      },
    });
  },
  async createNofication(req, res) {
    const data = req.body;

    if (!data) {
      return new BadResquestError().send(res);
    }

    const notification = await NotificationAdminServices.createNotification(
      data
    );

    if (!notification) {
      return new BadResquestError().send(res);
    }

    return new CreatedResponse(201, notification).send(res);
  },
  async updateNotification(req, res) {
    const { notification_id } = req.params;
    const data = req.body;

    if (!notification_id || !isValidObjectId(notification_id) || !data) {
      return new BadResquestError().send(res);
    }

    const notification = await NotificationAdminServices.updateNotification(
      notification_id,
      data
    );

    if (!notification) {
      return new BadResquestError().send(res);
    }

    return new CreatedResponse(201, { message: "read true" }).send(res);
  },
};

module.exports = NotificationController;
