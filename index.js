const express = require("express");
const router = require("./src/routes/root");
const middlewares = require("./src/middlewares/main");
const { PORT } = require("./src/config");
const path = require("path");
const api = require("./src/routes/api/api");
const cors = require("cors");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

//! Middlewares
app.use(
  cors({
    origin: "https://google.com",
    methods: ["GET", "POST"],
  })
);

app.use(middlewares);

//! Routes
app.use("/", router);
app.use("/api", api);

//! Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
