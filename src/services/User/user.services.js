const { getDateTime } = require("../../helpers/getDateTime");
const { User } = require("../../models/index");

class UserServices {
  async getUsers() {
    const users = await User.find({});
    return users;
  }

  async getUser(user_id, selectOptions) {
    if (!user_id) return null;

    const user = await User.findById({ _id: user_id }).select({
      ...selectOptions,
    });
    return user;
  }

  async getUserByEmail(email, select) {
    if (!email) return null;

    const user = await User.findOne({ email }).select({ ...select });
    return user;
  }

  async createUser(payload) {
    if (!payload) return null;

    const user = await User.create(payload);
    if (!user) return null;

    return user;
  }

  async updateUser(user_id, payload) {
    if (!user_id || !payload) return null;
    const date = getDateTime();
    const user = await User.findByIdAndUpdate(
      { _id: user_id },
      { $set: { ...payload, updatedAt: date }, upsert: true, new: true }
    );

    return user;
  }

  async changePassword(user_id, password) {
    if (!user_id || !password) return null;

    const date = getDateTime();
    const user = await User.findByIdAndUpdate(
      { _id: user_id },
      { $set: { password, updatedAt: date }, upsert: true, new: true }
    );

    return user;
  }

  async banUser(user_id) {
    if (!user_id) return null;

    const userBanned = await User.findOneAndUpdate(
      { _id: user_id },
      { $set: { banned: true } }
    );

    return userBanned;
  }

  async unbanUser(user_id) {
    if (!user_id) return null;

    const userBanned = await User.findOneAndUpdate(
      { _id: user_id },
      { $set: { banned: false } }
    );

    return userBanned;
  }
}

module.exports = new UserServices();
