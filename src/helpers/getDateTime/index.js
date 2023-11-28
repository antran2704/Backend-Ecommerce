const getDateTime = () => {
  const date = new Date();

  return date;
};

const isValidDate = (date) => {
  return !isNaN(new Date(date));
}

module.exports = { getDateTime, isValidDate };
