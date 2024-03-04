const { isValidObjectId } = require("mongoose");
const { Banner } = require("../../models");
const { getDateTime } = require("../../helpers/getDateTime");

class BannerServices {
  async getBanners(select = null, query = {}) {
    const banners = await Banner.find({ ...query, isDeleted: false })
      .select({ ...select })
      .lean();

    return banners;
  }

  async getBannersWithPage(pageSize, currentPage, select = null, query = {}) {
    const categories = await Banner.find({ ...query, isDeleted: false })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .select({ ...select })
      .lean();

    return categories;
  }

  async getBanner(banner_id) {
    if (!banner_id || !isValidObjectId(banner_id)) return;

    const banner = await Banner.findById({ _id: banner_id }).lean();

    return banner;
  }

  async createBanner(data) {
    if (!data) return;

    const banner = await Banner.create({ ...data });

    return banner;
  }

  async updateBanner(id, payload) {
    if (!id || !isValidObjectId(id)) {
      return null;
    }

    const date = getDateTime();

    const banner = await Banner.findById({ _id: id });

    await banner.updateOne({
      $set: { ...payload, updatedAt: date },
      upsert: true,
      new: true,
    });

    return banner;
  }

  async deleteBanner(id) {
    if (!id || !isValidObjectId(id)) {
      return null;
    }

    const date = getDateTime();

    const banner = await Banner.findById({ _id: id });

    await banner.updateOne({
      $set: { isDeleted: true, updatedAt: date },
      upsert: true,
      new: true,
    });

    return banner;
  }
}

module.exports = new BannerServices();