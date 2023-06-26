const express = require("express");
const router = express.Router();

const fs = require("fs");

router.post("/", (req, res) => {
  const filePath = req.body.path;
  fs.unlinkSync(filePath);

  res.status(200).json({
    status: 200,
    message: "Delete image succesfully",
  });
});

module.exports = router;
