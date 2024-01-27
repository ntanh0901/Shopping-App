const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("admin", {
    title: "admin",
    GioiTinh: "male",
  });
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    title: "Admin dashboard page",
    // isAdmin: true,
    isDashboard: true,
    GioiTinh: "male",
  });
});
module.exports = router;
