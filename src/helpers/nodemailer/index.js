const handlebars = require("express-handlebars");
const fs = require("fs");
const path = require("path");

const handleSendMail = require("../../configs/mailServices");

const readHTMLFile = (path, callback, content) => {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html, content);
    }
  });
};

const createHTMLEmail = (err, html, mailContent) => {
  if (err) {
    console.log("error reading file", err);
    return;
  }
  const viewEngine = handlebars.create({
    extname: ".hbs",
    partialsDir: path.resolve(__dirname, "../../views/partials/"),
    defaultLayout: false,
  });

  handleSendMail(mailContent, viewEngine);
};

const createHTML = {
  email: createHTMLEmail,
};

module.exports = { readHTMLFile, createHTML };
