const { format } = require("date-fns");
const crypto = require("crypto");
const config_VNPAY = require("../../configs/VNPAY");

const {
  InternalServerError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const { CreatedResponse } = require("../../helpers/successResponse");
const { OrderServices, CartServices } = require("../../services");
const { paymentStatus } = require("../OrderController/status");

const sortObject = (params) => {
  const vnpUrl = config_VNPAY.VNP_URL;
  const url = new URL(vnpUrl);

  Object.entries(params)
    .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
    .forEach(([key, value]) => {
      if (!value || value === "" || value === undefined || value === null) {
        return;
      }

      url.searchParams.append(key, value.toString());
    });

  return url;
};

const PaymentController = {
  createPayment: (req, res) => {
    const data = req.body;

    const ipAddr = "127.0.0.1";

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_SECRET_KEY;
    

    const date = new Date();
    const createDate = format(date, "yyyyMMddHHmmss");
    const order_id = data.order_id;
    const amount = data.total;
    const returnUrl = `${config_VNPAY.RETURN_URL}/${order_id}`;

    const orderInfo = `Thanh toan don hang ${order_id}`;
    const orderType = "other";
    let locale = "";

    if (locale === null || locale === "") {
      locale = "vn";
    }

    const currCode = config_VNPAY.VNP_CURR;
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = config_VNPAY.VNP_VERSION;
    vnp_Params["vnp_Command"] = config_VNPAY.VNP_COMMAND;
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = order_id;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    const redirectUrl = sortObject(vnp_Params);

    const hmac = crypto.createHmac(config_VNPAY.CRYPTO_ALGORITHM, secretKey);
    const signed = hmac
      .update(
        Buffer.from(
          redirectUrl.search.slice(1).toString(),
          config_VNPAY.CRYPTO_ENCODING
        )
      )
      .digest("hex");

    redirectUrl.searchParams.append("vnp_SecureHash", signed);
    return new CreatedResponse(201, redirectUrl).send(res);
  },
  responsePayment: async (req, res, next) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];
    const res_code = vnp_Params["vnp_ResponseCode"];
    const order_id = vnp_Params["vnp_TxnRef"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    const url = sortObject(vnp_Params);
    const secretKey = process.env.VNP_SECRET_KEY;

    const hmac = crypto.createHmac(config_VNPAY.CRYPTO_ALGORITHM, secretKey);
    const signed = hmac
      .update(
        Buffer.from(
          url.search.slice(1).toString(),
          config_VNPAY.CRYPTO_ENCODING
        )
      )
      .digest("hex");

    try {
      // const order = await OrderServices.getOrderByOrderID(order_id);

      // if (!order) {
      //   return new BadResquestError(400, {
      //     message: "Not found order",
      //   }).send(res);
      // }

      if (secureHash === signed && res_code === "00") {
        req.body.payment_status = paymentStatus.success;
        // const updated = await OrderServices.updateOrder(order_id, {
        //   payment_status: paymentStatus.success,
        // });

        // if (!updated) {
        //   return new BadResquestError(400, {
        //     message: "Updated order failed",
        //   }).send(res);
        // }
      } else {
        req.body.payment_status = paymentStatus.cancle;
        // const updated = await OrderServices.updateOrder(order_id, {
        //   payment_status: paymentStatus.cancle,
        // });

        // if (!updated) {
        //   return new BadResquestError(400, {
        //     message: "Updated order failed",
        //   }).send(res);
        // }
      }

      // const cart = await CartServices.getCartByUserId(order.user_id);

      // if (!cart) {
      //   return new BadResquestError(400, "Not found cart").send(res);
      // }

      // CartServices.deleteAllItemCart(cart._id);
      // CartServices.updateCart(order.user_id, {
      //   cart_count: 0,
      //   cart_total: 0,
      // });

      // res.redirect(`http://localhost:3000/checkout/${order_id}`);
      next();
    } catch (error) {
      return new InternalServerError(error.stack).send(res);
    }
  },
};

module.exports = PaymentController;
