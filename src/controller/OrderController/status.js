const typeStatus = {
  pending: "pending",
  processing: "processing",
  delivered: "delivered",
  cancle: "cancle",
};

const paymentStatus = {
  pending: "pending",
  cancle: "cancle",
  success: "success",
};

const paymentMethod = {
  cod: "cod",
  card: "card",
  cash: "cash",
  vnpay: "vnpay",
  banking: "banking"
}

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
  order: {
    template: "email/newOrder"
  }
};

module.exports = { typeStatus, templateEmail, paymentStatus, paymentMethod };
