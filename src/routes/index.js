const routes = (app) => {
  app.use("/", (req, res) => {
    res.json("hello from server");
  });
};

module.exports = routes;
