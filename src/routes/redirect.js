const express = require("express");
const redirectRouter = express.Router();
const path = require("path");

redirectRouter.get("/", (req, res) => {
  console.log(req.params);
});
redirectRouter.get("/:id", (req, res) => {
  console.log(req.params.id);
});

// redirectRouter.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../..", "public", "404.html"));
// });

module.exports = redirectRouter;
