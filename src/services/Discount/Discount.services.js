const { isValidObjectId } = require("mongoose");
const { getDateTime } = require("../../helpers/getDateTime");
const { Discount } = require("../../models");

class DiscountServices {
  async getDiscountsAvailable() {
    const discount = await Discount.find({
      isDelete: false,
    })
      .sort({ createdAt: -1 })
      .lean();
    return discount;
  }

  async getDiscounts(select = {}) {
    const discounts = await Discount.find({ isDelete: false })
      .select({ ...select })
      .sort({ createdAt: -1 })
      .lean();
    return discounts;
  }

  async getDiscountsWithPage(pageSize, currentPage, select = {}) {
    const discounts = await Discount.find({ isDelete: false })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .select({ ...select })
      .sort({ createdAt: -1 })
      .lean();

    return discounts;
  }

  async getDiscountById(id, select) {
    if (!id || !isValidObjectId(id)) return null;

    const discount = await Discount.findOne({ _id: id, isDelete: false })
      .select({ ...select })
      .lean();
    return discount;
  }

  async getDiscountByCode(discount_code, select) {
    if (!discount_code) return null;

    const discount = await Discount.findOne({ discount_code, isDelete: false })
      .select({ ...select })
      .lean();
    return discount;
  }

  async getDiscountClient(discount_code, select) {
    if (!discount_code) return null;

    const discount = await Discount.findOne({
      discount_code,
      isDelete: false,
      discount_public: true,
    })
      .select({ ...select })
      .lean();
    return discount;
  }

  async createDiscount(payload) {
    const newDiscount = await Discount.create({ ...payload });
    return newDiscount;
  }

  async searchDiscounts(text = "", start_date = "", end_date = "") {
    if (start_date.length > 0 && end_date.length > 0) {
      const totalItems = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_start_date: { $gte: new Date(start_date) },
        discount_end_date: { $lte: new Date(end_date) },
        isDelete: false,
      })
        .sort({ createdAt: -1 })
        .lean();

      return totalItems;
    }

    if (end_date.length > 0) {
      const totalItems = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_end_date: { $lte: new Date(end_date) },
        isDelete: false,
      })
        .sort({ createdAt: -1 })
        .lean();

      return totalItems;
    }

    if (start_date.length > 0) {
      const totalItems = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_start_date: { $gte: new Date(start_date) },
        isDelete: false,
      })
        .sort({ createdAt: -1 })
        .lean();

      return totalItems;
    }

    const totalItems = await Discount.find({
      $or: [
        { discount_name: { $regex: text, $options: "i" } },
        { discount_code: { $regex: text, $options: "i" } },
      ],
      isDelete: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    return totalItems;
  }

  async searchDiscountsWithPage(
    text = "",
    start_date = "",
    end_date = "",
    pageSize,
    currentPage
  ) {
    if (start_date.length > 0 && end_date.length > 0) {
      const totalItems = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_start_date: { $gte: new Date(start_date) },
        discount_end_date: { $lte: new Date(end_date) },
        isDelete: false,
      })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean();

      return totalItems;
    }

    if (end_date.length > 0) {
      const totalItems = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_end_date: { $lte: new Date(end_date) },
        isDelete: false,
      })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean();

      return totalItems;
    }

    if (start_date.length > 0) {
      const discounts = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_start_date: { $gte: new Date(start_date) },
        isDelete: false,
      })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean();

      return discounts;
    }

    const discounts = await Discount.find({
      $or: [
        { discount_name: { $regex: text, $options: "i" } },
        { discount_code: { $regex: text, $options: "i" } },
      ],
      isDelete: false,
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean();

    return discounts;
  }

  validDateDiscount(start_date, end_date) {
    if (
      // new Date() < new Date(start_date) ||
      new Date() > new Date(end_date) ||
      new Date(start_date) > new Date(end_date)
    ) {
      return false;
    }

    return true;
  }

  async updateDiscount(id, payload) {
    if (!id || !isValidObjectId(id)) return null;

    const date = getDateTime();
    const updated = await Discount.findOneAndUpdate(
      { _id: id, isDelete: false },
      { $set: { ...payload, updatedAt: date } },
      { upsert: true, new: true }
    );
    return updated;
  }

  async checkUsedDiscount(discount_code, user_id, select) {
    if (!discount_code || !user_id) return null;

    const used = await Discount.findOne({
      discount_code,
      discount_user_used: { $elemMatch: { user_id } },
      isDelete: false,
    })
      .select({ ...select })
      .lean();
    return used;
  }

  async updateUsedDiscount(discount_code, user_id) {
    if (!discount_code) return null;

    const updated = await Discount.findOneAndUpdate(
      { discount_code },
      {
        $push: {
          discount_user_used: { user_id, count: 1 },
        },
        $inc: { discount_max_uses: -1, discount_used_count: 1 },
      }
    );
    return updated;
  }

  async updateUsedCountDiscount(discount_code, user_id) {
    if (!discount_code) return null;

    const updated = await Discount.findOneAndUpdate(
      { discount_code },
      {
        $inc: {
          "discount_user_used.$[i].count": 1,
          discount_max_uses: -1,
          discount_used_count: 1,
        },
      },
      {
        arrayFilters: [
          {
            "i.user_id": user_id,
          },
        ],
        upsert: true,
      }
    );
    return updated;
  }

  async deleteDiscount(id) {
    if (!id || !isValidObjectId(id)) return null;

    const date = getDateTime();
    const discount = await Discount.findOneAndUpdate(
      { _id: id },
      { $set: { isDelete: true, updatedAt: date } }
    );
    return discount;
  }
}

module.exports = new DiscountServices();
