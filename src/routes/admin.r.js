const express = require("express");
const router = express.Router();

router.get("/admin", (req, res) => {
  res.render("admin", {
    title: "admin",
    GioiTinh: "male",
  });
});

router.get("/admin/dashboard", (req, res) => {
  res.render("dashboard", {
    title: "Admin dashboard page",
    // isAdmin: true,
    isDashboard: true,
    GioiTinh: "male",
  });
});
module.exports = router;
