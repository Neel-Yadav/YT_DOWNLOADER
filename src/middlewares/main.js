const express = require("express");
const path = require("path");

const middlewares = express.Router();

middlewares.use(express.json());
middlewares.use(express.urlencoded({ extended: false }));
middlewares.use(express.static(path.join(__dirname, "../..", "downloads")));
middlewares.use(express.static(path.join(__dirname, "../..", "public")));
middlewares.use(express.static(path.join(__dirname, "../..", "public/views")));
middlewares.use(
  express.static(path.join(__dirname, "../..", "public/views/css"))
);
middlewares.use(express.static(path.join(__dirname, "../..", "public/assets")));

module.exports = middlewares;
