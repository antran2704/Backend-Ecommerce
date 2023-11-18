const getSelect = (query = {}) => {
  const select = {};
  const keys = query;

  Object.keys(keys).forEach((key) => {
    if (key !== "page") {
      select[key] = Number(query[key]);
    }
  });

  return select;
};

module.exports = getSelect;