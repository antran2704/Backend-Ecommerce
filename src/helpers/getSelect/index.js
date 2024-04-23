const getSelect = (query = {}, notIn = []) => {
  const select = {};
  const keys = query;

  Object.keys(keys).forEach((key) => {
    if (key !== "page" && key !== "limit" && !notIn.includes(key)) {
      select[key] = Number(query[key]);
    }
  });

  return Object.keys(select).length > 0 ? select : null;
};

module.exports = getSelect;
