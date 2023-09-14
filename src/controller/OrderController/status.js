const typeStatus = ["pending", "cancle", "success"];

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
