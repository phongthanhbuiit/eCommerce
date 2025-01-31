// this is file run nodejs with port
// run project `node --watch server.js`

const app = require("./src/app");

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(`web service eCommerce start with port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server Express"));
});
