const checkValidEmail = (email) => {
  const validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)/;

  if (!email || !validRegex.test(email)) {
    return false;
  }

  return true;
};

module.exports = { checkValidEmail };
