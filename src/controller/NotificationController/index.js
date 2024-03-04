const { CreatedResponse } = require("../../helpers/successResponse");

const NotificationController = {
  sendNotifi(req, res) {
    const { content } = req.body;
   
    socket.emit("notification", content);

    return new CreatedResponse().send(res);
  },
};

module.exports = NotificationController;
