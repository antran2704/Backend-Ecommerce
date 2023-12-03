const handleQueryParse = (query) => {
  const queryParse = {};

  for (const key of Object.keys(query)) {
    if (
      query[key] !== null &&
      query[key] !== undefined &&
      query[key].length > 0
    ) {
      queryParse[key] = query[key];
    }
  }

  return queryParse;
};

module.exports = handleQueryParse;
