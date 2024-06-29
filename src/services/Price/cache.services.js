class CachePriceServices {
  KEY_PRICE = "price:";

  async getPrice(key) {
    const cache = await redisGlobal.get(key);

    if (!cache) return null;

    return JSON.parse(cache);
  }

  async exitCachePrice(key) {
    const isExit = await redisGlobal.exists(key);

    return isExit;
  }

  async setCachePrice(key, data) {
    const stringData = JSON.stringify(data);
    await redisGlobal.set(key, stringData);
  }

  async setExprisePrice(key, time, mode = "XX") {
    await redisGlobal.expireAt(key, time, mode);
  }

  async updateCachePrice(key, data) {
    const stringData = JSON.stringify(data);
    const updated = await redisGlobal.set(key, stringData);
    return updated;
  }

  async deleteCachePrice(key) {
    await redisGlobal.del(key);
  }
}

module.exports = new CachePriceServices();
