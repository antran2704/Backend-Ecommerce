const { Types } = require("mongoose");

const convertObjectToString = (id) => {
  return id.toString();
};

module.exports = convertObjectToString;