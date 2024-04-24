class CacheBannerServices {
  KEY_BANNER = "banners:";

  async getCacheBanner(key) {
    const cacheBanners = await redisGlobal.lRange(key, 0, -1);

    if (cacheBanners.length <= 0) return null;

    const categories = cacheBanners.map((category) => JSON.parse(category));

    return categories;
  }

  async setCacheBanner(key, banners) {
    for (const banner of banners) {
      await redisGlobal.rPush(
        key,
        JSON.stringify({
          _id: banner._id,
          title: banner.title,
          image: banner.image,
          meta_title: banner.meta_title,
        })
      );
    }
  }

  async isExitCache(key) {
    const cacheBanners = await redisGlobal.exists(key);

    return cacheBanners;
  }

  async updateCache(key, banners) {
    await this.clearCache();

    for (const banner of banners) {
      await redisGlobal.rPush(
        key,
        JSON.stringify({
          _id: banner._id,
          title: banner.title,
          image: banner.image,
          meta_title: banner.meta_title,
        })
      );
    }
  }

  async clearCache(key) {
    await redisGlobal.del(key);
  }
}

module.exports = new CacheBannerServices();
