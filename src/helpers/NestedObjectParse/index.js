const removeUndefindedObj = (obj) => {
  const keys = Object.keys(obj || {});

  keys.forEach((k) => {
    if (obj[k] === null || obj[k] === undefined) {
      delete obj[k];
    } else if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      obj[k] = removeUndefindedObj(obj[k]);
    }
  });

  return obj;
};

module.exports = { removeUndefindedObj };
