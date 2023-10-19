const { KeyToken } = require("../../models");
const convertObjectToString = require("../../helpers/convertObjectString");
const { getDateTime } = require("../../helpers/getDateTime");

class KeyTokenServices {
  async createKeyToken(user_id, privateKey, publicKey, refreshToken) {
    if (!user_id || !privateKey || !publicKey || !refreshToken) {
      return null;
    }

    const keyToken = await KeyToken.create({
      user: user_id,
      privateKey,
      publicKey,
      refreshToken,
    });

    return keyToken;
  }

  async getKeyByUserId(user_id, selectOptions) {
    if (!user_id) return null;

    const keyToken = await KeyToken.findOne({
      user: convertObjectToString(user_id),
    })
      .select({ ...selectOptions })
      .lean();

    if (!keyToken) return null;

    return keyToken;
  }

  async getRefeshToken(refreshToken, selectOptions) {
    if (!refreshToken) return null;

    const keyToken = await KeyToken.findOne({
      refreshToken,
    })
      .select({ ...selectOptions })
      .lean();

    if (!keyToken) return null;

    return keyToken;
  }

  async updateKeyToken(user_id, payload) {
    if (!user_id) return null;
    const date = getDateTime();
    const keyToken = await KeyToken.findOneAndUpdate(
      { user: user_id },
      { $set: { ...payload, updatedAt: date } }
    );

    if (!keyToken) return null;

    return keyToken;
  }

  async checkTokenUsed(user_id, token) {
    if (!user_id) return null;

    const usedToken = await KeyToken.findOne({
      user: convertObjectToString(user_id),
      refreshTokenUseds: { $in: [token] },
    });

    return usedToken;
  }

  async deleteToken(user_id) {
    if (!user_id) return null;

    const tokenDeleted = await KeyToken.findOneAndDelete({
      user: convertObjectToString(user_id),
    });

    return tokenDeleted;
  }
}

module.exports = new KeyTokenServices();
