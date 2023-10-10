const { Types } = require("mongoose");

const convertObjectToString = (id) => {
  return Types.ObjectId(id);
};

module.exports = convertObjectToString;