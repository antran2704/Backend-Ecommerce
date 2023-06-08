const express = require("express");
const router = express.Router();

const fs = require("fs");

router.post("/", (req, res) => {
  const filePath = req.body.path;
  fs.unlinkSync(filePath, function (err) {
    if (err && err.code == "ENOENT") {
      res.status(404).json({
        status: 404,
        message: "File doesn't exist, won't remove it.",
      });
    } else if (err) {
      res.status(500).json({
        status: 500,
        message: "Error occurred while trying to remove file",
      });
    } else {
      res.status(200).json({
        status: 200,
        message: "Delete image succesfully",
      });
    }
  });
});

module.exports = router;
