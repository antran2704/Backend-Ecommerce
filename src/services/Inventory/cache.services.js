class CacheInventoryServices {
  KEY_INVENTORY = "inventory:";

  async getInventory(key) {
    const cache = await redisGlobal.get(key);

    if (!cache) return null;

    return JSON.parse(cache);
  }

  async exitCacheInventory(key) {
    const isExit = await redisGlobal.exists(key);

    return isExit;
  }

  async setCacheInventory(key, data) {
    const stringData = JSON.stringify(data);
    await redisGlobal.set(key, stringData);
  }

  async setExpriseInventory(key, time, mode = "XX") {
    await redisGlobal.expireAt(key, time, mode);
  }

  async updateCacheInventory(key, data) {
    const stringData = JSON.stringify(data);
    const updated = await redisGlobal.set(key, stringData);
    return updated;
  }

  async deleteCacheInventory(key) {
    await redisGlobal.del(key);
  }
}

module.exports = new CacheInventoryServices();
