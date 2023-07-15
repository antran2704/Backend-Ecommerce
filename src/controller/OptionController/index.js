const { Option } = require("../../models");

const OptionController = {
  // [GET] ALL OPTIONS
  getAllOptions: async (req, res) => {
    try {
      const options = await Option.find({});
      return res.status(200).json({
        status: 200,
        payload: options,
      });
    } catch (error) {
      console.log(error);
    }
  },
  //[GET] AN OPTION
  getAnOption: async (req, res) => {
    const id = req.params.id;

    if (!id) {
      return res.status(404).json({
        status: 404,
        message: "Id Option is invalid",
      });
    }

    try {
      const option = await Option.findById(id);

      if (!option) {
        return res.status(404).json({
          status: 404,
          message: "Option is not exit",
        });
      }

      return res.status(200).json({
        status: 200,
        payload: option,
      });
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = OptionController;
