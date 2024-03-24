const ImageMiddleware = {
  checkPathImage: (req, res, next) => {
    const path = req.file.path.replaceAll("\\", "/");
    req.file.path = `${process.env.SERVER_ENDPOINT}/${path}`;

    next();
  },
};

module.exports = { ImageMiddleware };
