const typeStatus = {
  pending: "pending",
  success: "success",
  cancle: "cancle",
};

const templateEmail = {
  pending: {
    template: "email/pending",
  },
  success: {
    template: "email/success",
  },
  cancle: {
    template: "email/cancle",
  },
};

module.exports = { typeStatus, templateEmail };
