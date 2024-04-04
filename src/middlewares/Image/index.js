const ImageMiddleware = {
  checkPathImage: (req, res, next) => {
    const path = req.file.path.replaceAll("\\", "/");
    req.file.path = `/${path}`;

    next();
  },
};

module.exports = { ImageMiddleware };
