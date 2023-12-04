const { ApiKey } = require("../../models");
const { getDateTime } = require("../../helpers/getDateTime");
const { isValidObjectId } = require("mongoose");

class ApiKeyServices {
  async createApiKey(user_id, key, permissions) {
    if (!user_id || !key || !isValidObjectId(user_id)) return null;

    const newApiKey = await ApiKey.create({
      key,
      user_id,
      permissions,
      status: true,
    });

    return newApiKey;
  }

  async getApiKey(key) {
    if (!key) return null;

    const apiKey = await ApiKey.findOne({ key }).lean();
    return apiKey;
  }

  async getApiKeyByUserId(user_id) {
    if (!user_id || !isValidObjectId(user_id)) return null;

    const apiKey = await ApiKey.findOne({ user_id }).lean();
    return apiKey;
  }

  async updateApiKey(key, payload) {
    if (!key) return null;

    const date = getDateTime();
    const apiKey = await ApiKey.findOneAndUpdate(
      { key },
      { $set: { ...payload, updatedAt: date } },
      {
        new: true,
        upsert: true,
      }
    ).lean();
    return apiKey;
  }
}

module.exports = new ApiKeyServices();
