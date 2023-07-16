const express = require("express");
const router = express.Router();

const fs = require("fs");

router.post("/images", (req, res) => {
  const images = req.body.images;
  console.log(images);
  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const path = images[i].filePath;
      const filePath = path.replace(process.env.API_ENDPOINT, "./");
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      status: 200,
      message: "Delete image succesfully",
    });
  }
});

router.post("/", (req, res) => {
  const path = req.body.filePath;
  const filePath = path.replace(process.env.API_ENDPOINT, "./");
  fs.unlinkSync(filePath);

  res.status(200).json({
    status: 200,
    message: "Delete image succesfully",
  });
});

module.exports = router;
