class CacheCategoriesServices {
  KEY_PARENT_CATEGORIES = "paren_categories"

  async getCache(key) {
    const cacheCategories = await redisGlobal.lRange(key, 0, -1);

    if (cacheCategories.length <= 0) return null;

    const categories = cacheCategories.map((category) => JSON.parse(category));

    return categories;
  }

  async createCache(key, categories) {
    for (const category of categories) {
      await redisGlobal.rPush(
        key,
        JSON.stringify({
          _id: category._id,
          title: category.title,
          description: category.description,
          thumbnail: category.thumbnail,
          slug: category.slug,
        })
      );
    }
  }

  async isExitCache(key) {
    const cacheCategories = await redisGlobal.exists(key);

    return cacheCategories;
  }

  async updateCache(key, categories) {
    await this.clearCache();

    for (const category of categories) {
      await redisGlobal.rPush(
        key,
        JSON.stringify({
          _id: category._id,
          title: category.title,
          description: category.description,
          thumbnail: category.thumbnail,
          slug: category.slug,
        })
      );
    }
  }

  async clearCache(key) {
    await redisGlobal.del(key);
  }
}

module.exports = new CacheCategoriesServices();
