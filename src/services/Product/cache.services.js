class CacheProductServices {
  KEY_PRODUCT = "product:";

  async getProduct(key) {
    const cacheProduct = await redisGlobal.get(key);

    if (!cacheProduct) return null;

    return JSON.parse(cacheProduct);
  }

  async exitCacheProduct(key) {
    const isExit = await redisGlobal.exists(key);

    return isExit;
  }

  async setCacheProduct(key, data) {
    const stringData = JSON.stringify(data);
    await redisGlobal.set(key, stringData);
  }

  async setExpriseProduct(key, time, mode = "XX") {
    await redisGlobal.expireAt(key, time, mode);
  }

  async updateCacheProduct(key, data) {
    const stringData = JSON.stringify(data);
    const updated = await redisGlobal.set(key, stringData);
    return updated;
  }

  async deleteCacheProduct(key) {
    await redisGlobal.del(key);
  }
}

module.exports = new CacheProductServices();
