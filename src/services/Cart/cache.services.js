class CacheCartServices {
  KEY_CART = "cart:";

  async getCart(key) {
    const cacheCart = await redisGlobal.hGetAll(key);

    if (!cacheCart._id) return null;

    return cacheCart;
  }

  async exitCacheCart(key, field) {
    const isExit = await redisGlobal.hExists(key, field);

    return isExit;
  }

  async setCacheCart(key, data) {
    await redisGlobal.hSet(key, data);
  }

  async updateCacheCart(key, field, value) {
    const updated = await redisGlobal.hIncrBy(key, field, value);
    return updated;
  }

  async deleteCacheCart(key) {
    await redisGlobal.del(key);
  }
}

module.exports = new CacheCartServices();
