const typeStatus = {
  pending: "pending",
  processing: "processing",
  delivered: "delivered",
  cancle: "cancle",
};

const templateEmail = {
  pending: {
    template: "email/pending",
  },
  delivered: {
    template: "email/delivered",
  },
  processing: {
    template: "email/processing",
  },
  cancle: {
    template: "email/cancle",
  },
};

module.exports = { typeStatus, templateEmail };
