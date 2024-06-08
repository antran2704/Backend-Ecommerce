const VNP_VERSION = "2.1.0";
const VNP_COMMAND = "pay";
const VNP_URL = process.env.VNP_URL;
const RETURN_URL = process.env.SERVER_ENDPOINT + "/api/v1/payment/vnpay/response";
const VNP_CURR = "VND";
const CRYPTO_ALGORITHM = 'sha512';
const CRYPTO_ENCODING = 'utf-8';

module.exports = { VNP_COMMAND, VNP_VERSION, VNP_URL, RETURN_URL, VNP_CURR, CRYPTO_ALGORITHM, CRYPTO_ENCODING };
