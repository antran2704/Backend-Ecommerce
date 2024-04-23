class CacheUserServices {
  KEY_USER = "user:";

  async getUser(key) {
    const cacheUser = await redisGlobal.hGetAll(key);

    if (!cacheUser._id) return null;

    return cacheUser;
  }

  async exitCacheUser(key, field) {
    const isExit = await redisGlobal.hExists(key, field);

    return isExit;
  }

  async setCacheUser(key, data) {
    await redisGlobal.hSet(key, data);
  }

  async setExpriseUser(key, time, mode = "XX") {
    await redisGlobal.expireAt(key, time, mode);
  }

  async updateCacheUser(key, field, value) {
    const updated = await redisGlobal.hSet(key, field, value);
    return updated;
  }

  async deleteCacheUser(key) {
    await redisGlobal.del(key);
  }
}

module.exports = new CacheUserServices();
