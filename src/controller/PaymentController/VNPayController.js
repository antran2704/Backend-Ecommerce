const { format } = require("date-fns");
const crypto = require("crypto");
const config_VNPAY = require("../../configs/VNPAY");

const {
  InternalServerError,
  NotFoundError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const {
  GetResponse,
  CreatedResponse,
} = require("../../helpers/successResponse");

const PaymentController = {
  createPayment: (req, res) => {
    const data = req.body;

    const ipAddr = "127.0.0.1";

    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_SECRET_KEY;
    const vnpUrl = config_VNPAY.VNP_URL;
    const returnUrl = config_VNPAY.RETURN_URL;

    const date = new Date();

    const createDate = format(date, "yyyyMMddHHmmss");
    const order_id = data.order_id;
    const amount = data.total;

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

    const redirectUrl = new URL(vnpUrl);
    "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1000000&vnp_Command=pay&vnp_CreateDate=20240214172913&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+don+hang+undefined&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A3000&vnp_TmnCode=2DZV4855&vnp_Version=2.1.0&vnp_SecureHash=2826225e5c5e611b13aeaec77b0ae27cc52102add207e706b11a1d70900eca4b235b8fb5629eada8e2096dc06ba4c956d57f78b7924ac3581951787b3efadeaf"
    Object.entries(vnp_Params)
      .sort(([key1], [key2]) => key1.toString().localeCompare(key2.toString()))
      .forEach(([key, value]) => {
        if (!value || value === "" || value === undefined || value === null) {
          return;
        }

        redirectUrl.searchParams.append(key, value.toString());
      });

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
};

module.exports = PaymentController;
