const getSelect = (query = {}) => {
  const select = {};
  const keys = query;
  
  Object.keys(keys).forEach((key) => {
    if (key !== "page" && key !== "limit") {
      select[key] = Number(query[key]);
    }
  });

  return Object.keys(select).length > 0 ? select : null;
};

module.exports = getSelect;
