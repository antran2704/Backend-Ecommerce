const { User } = require("../../models/index");

class UserServices {
  async getUsers() {
    const users = await User.find({});
    return users;
  }

  async getUser(user_id, selectOptions) {
    if (!user_id) return null;

    const user = await User.findById({ _id: user_id }).select({...selectOptions});
    return user;
  }

  async getUserByEmail(email, selectOptions) {
    if (!email) return null;

    const user = await User.findOne({ email }).select({...selectOptions});
    return user;
  }

  async createUser(payload) {
    if (!payload) return null;

    const user = await User.create(payload);
    if (!user) return null;

    return user;
  }

  async banUser(user_id) {
    if(!user_id) return null;

    const userBanned = await User.findOneAndUpdate({_id: user_id}, {$set: {banned: true}});

    return userBanned;
  }

  async unbanUser(user_id) {
    if(!user_id) return null;

    const userBanned = await User.findOneAndUpdate({_id: user_id}, {$set: {banned: false}});

    return userBanned;
  }
}

module.exports = new UserServices();
