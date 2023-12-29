const { isValidObjectId } = require("mongoose");
const { getDateTime } = require("../../helpers/getDateTime");
const { GrossDate } = require("../../models/index");

class GrossDateServices {
  async getGrossInHome() {
    const currentDate = new Date();
    const preDate = new Date();
    preDate.setDate(currentDate.getDate() - 5);

    const items = await GrossDate.find({
      $and: [
        { createdAt: { $gte: new Date(preDate) } },
        { createdAt: { $lte: new Date(currentDate) } },
      ],
    })
      .lean()
      .limit(5);

    return items;
  }

  async getGrossInWeek(start_date) {
    const startDate = new Date(start_date);
    const endDate = new Date(start_date);
    endDate.setDate(startDate.getDate() + 6);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(24, 0, 0, -1);

    const items = await GrossDate.find({
      $and: [
        { createdAt: { $gte: startDate } },
        { createdAt: { $lte: endDate } },
      ],
    })
      .lean()
      .limit(7);

    return items;
  }

  async getGrossInDay(date) {
    if (!date) return null;

    const item = await GrossDate.findOne({ date }).lean();
    return item;
  }

  async getGrossById(gross_id) {
    if (!gross_id || !isValidObjectId(gross_id)) return null;

    const item = await GrossDate.findById({ _id: gross_id }).lean();
    return item;
  }

  async getGrossInMonth(month, year) {
    if (!month || !year) return null;

    const item = await GrossDate.find({ month, year }).lean();
    return item;
  }

  async createGross(data) {
    const date = getDateTime();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();

    const item = await GrossDate.create({
      date: date.toLocaleDateString("en-GB"),
      month,
      year,
      day,
    });

    // const item = await GrossDate.create({
    //   date: data.date,
    //   month,
    //   year,
    //   day: data.day,
    // });

    return item;
  }

  async updateGross(gross_id, query) {
    if (!gross_id || !isValidObjectId(gross_id)) return null;

    const date = getDateTime();

    const item = await GrossDate.findByIdAndUpdate(
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

module.exports = new GrossDateServices();
