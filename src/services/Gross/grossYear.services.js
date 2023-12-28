const { isValidObjectId } = require("mongoose");
const { getDateTime } = require("../../helpers/getDateTime");
const { GrossYear } = require("../../models/index");

class GrossYearServices {
  async getGross(select = {}) {
    const items = await GrossYear.find({})
      .select({ ...select })
      .lean();

    return items;
  }

  async getGrossByYear(year, select = {}) {
    if (!year) return null;

    const item = await GrossYear.findOne({ year }).select({...select}).lean();
    return item;
  }

  async createGross() {
    const date = getDateTime();
    const year = date.getFullYear();

    const item = await GrossYear.create({
      year,
    });

    return item;
  }

  async updateGross(gross_id, query) {
    if (!gross_id || !isValidObjectId(gross_id)) return null;

    const date = getDateTime();

    const item = await GrossYear.findByIdAndUpdate(
      { _id: gross_id },
      {
        ...query,
        $set: { updatedAt: date },
      },
      { new: true, upsert: true }
    );

    return item;
  }
}

module.exports = new GrossYearServices();
