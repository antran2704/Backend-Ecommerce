const { isValidObjectId } = require("mongoose");
const { getDateTime } = require("../../helpers/getDateTime");
const { Discount } = require("../../models");

class DiscountServices {
  // case 1: ngay bat dau phai nho hon ngay ket thuc || ngay ket thuc nho hon ngay hien tai
  // case 2: kiem tra type discount (percent || fixed amout)
  // case 3: kiem tra ap dung cho tat ca san pham || 1 vai san pham
  // case 4: kiem tra discount code da ton tai hay chua

  async getDiscountsAvailable() {
    const discount = await Discount.find({
      discount_active: true,
    })
      .sort({ createdAt: -1 })
      .lean();
    return discount;
  }

  async getDiscounts(select = {}) {
    const discounts = await Discount.find({ ...select })
      .sort({ createdAt: -1 })
      .lean();
    return discounts;
  }

  async getDiscountsWithPage(pageSize, currentPage, select = {}) {
    const discounts = await Discount.find({})
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .select({ ...select })
      .sort({ createdAt: -1 })
      .lean();

    return discounts;
  }

  async getDiscountByCode(discount_code, select) {
    if (!discount_code) return null;

    const discount = await Discount.findOne({ discount_code })
      .select({ ...select })
      .lean();
    return discount;
  }

  async createDiscount(payload) {
    const newDiscount = await Discount.create({ ...payload });
    return newDiscount;
  }

  async searchDiscounts(text = "", start_date, end_date) {
    if (start_date && end_date) {
      const totalItems = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_start_date: { $gte: new Date(start_date) },
        discount_end_date: { $lte: new Date(end_date) },
      })
        .sort({ createdAt: -1 })
        .lean();

      return totalItems;
    }

    if (end_date) {
      const totalItems = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_end_date: { $lte: new Date(end_date) },
      })
        .sort({ createdAt: -1 })
        .lean();

      return totalItems;
    }

    if (start_date) {
      const totalItems = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_start_date: { $gte: new Date(start_date) },
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
    })
      .sort({ createdAt: -1 })
      .lean();

    return totalItems;
  }

  async searchDiscountsWithPage(
    text = "",
    start_date,
    end_date,
    pageSize,
    currentPage
  ) {
    if (start_date && end_date) {
      const totalItems = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_start_date: { $gte: new Date(start_date) },
        discount_end_date: { $lte: new Date(end_date) },
      })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean();

      return totalItems;
    }

    if (end_date) {
      const totalItems = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_end_date: { $lte: new Date(end_date) },
      })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 })
        .lean();

      return totalItems;
    }

    if (start_date) {
      const discounts = await Discount.find({
        $or: [
          { discount_name: { $regex: text, $options: "i" } },
          { discount_code: { $regex: text, $options: "i" } },
        ],
        discount_start_date: { $gte: new Date(start_date) },
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
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean();

    return discounts;
  }

  validDateDiscount(start_date, end_date) {
    if (
      new Date() > new Date(start_date) ||
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
      { _id: id },
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
}

module.exports = new DiscountServices();
