const { isValidObjectId } = require("mongoose");
const { getDateTime } = require("../../helpers/getDateTime");
const { GrossDay } = require("../../models/index");

class GrossServices {
  async getGross() {
    const items = await GrossDay.find({}).lean().limit(7);

    return items;
  }

  async getGrossInDay(date) {
    if (!date) return null;

    const item = await GrossDay.findOne({ date }).lean();
    return item;
  }

  async getGrossWithId(gross_id) {
    if (!gross_id || !isValidObjectId(gross_id)) return null;

    const item = await GrossDay.findById({ _id: gross_id }).lean();
    return item;
  }

  async createGross() {
    const date = getDateTime();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();

    const item = await GrossDay.create({
      date: date.toLocaleDateString("en-GB"),
      month,
      year,
      day,
    });

    return item;
  }

  async updateGross(gross_id, query) {
    if (!gross_id || !isValidObjectId(gross_id)) return null;

    const date = getDateTime();

    const item = await GrossDay.findByIdAndUpdate(
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

module.exports = new GrossServices();
