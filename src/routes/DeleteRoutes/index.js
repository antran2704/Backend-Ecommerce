const express = require("express");
const router = express.Router();
const {
  InternalServerError,
  BadResquestError,
} = require("../../helpers/errorResponse");
const {
  CreatedResponse,
} = require("../../helpers/successResponse");

const fs = require("fs");

router.post("/images", async (req, res) => {
  const images = req.body.images;
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

router.post("/", async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return new BadResquestError(400, {
        message: "File path is required",
      }).send(res);
    }

    const path = filePath.replace(process.env.API_ENDPOINT, "./");

    const response = await fs.promises.rm(path);

    return new CreatedResponse(201, {
      message: "Delete image succesfully",
      response
    }).send(res);
  } catch (error) {
    return new InternalServerError().send(res);
  }
});

module.exports = router;
