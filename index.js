
const server = require("./app");
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`app listen on ${PORT}`);
});
