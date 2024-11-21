const express = require("express");
const router = express.Router();
const path = require("path");
const redirectRouter = require("./redirect");
const api = require("./api/api");

//! Root Route (Home Page)
router.get("^/$|/index(.html)?", (req, res) => {
  res.render("index", { response: res });
});
router.get("/link", (req, res) => {
  res.render("link");
});
//! Redirect Route
router.use("/redirect", redirectRouter);

//! Api Routes
router.use("/api", api);

//! Catch-All Route (404 Not Found)
router.get("/*", (req, res) => {
  res.redirect("/");
});

module.exports = router;
