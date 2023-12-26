const { isValidObjectId } = require("mongoose");
const { getDateTime } = require("../../helpers/getDateTime");
const { GrossMonth } = require("../../models/index");

class GrossMonthServices {
  async getGrossByYear(year) {
    if (!year) {
      year = new Date().getFullYear();
    }

    const items = await GrossMonth.find({ year }).lean();

    return items;
  }

  async getGrossByMonth(month, year) {
    if (!month || !year) return null;

    const item = await GrossMonth.findOne({ month, year }).lean();
    return item;
  }

  async getGrossById(gross_id) {
    if (!gross_id || !isValidObjectId(gross_id)) return null;

    const item = await GrossMonth.findById({ _id: gross_id }).lean();
    return item;
  }

  async createGross() {
    const date = getDateTime();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const item = await GrossMonth.create({
      month,
      year,
    });

    return item;
  }

  async updateGross(gross_id, query) {
    if (!gross_id || !isValidObjectId(gross_id)) return null;

    const date = getDateTime();

    const item = await GrossMonth.findByIdAndUpdate(
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

module.exports = new GrossMonthServices();
