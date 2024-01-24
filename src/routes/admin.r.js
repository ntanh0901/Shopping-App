const express = require("express");
const router = express.Router();

router.get("/admin", (req, res) => {
  res.render("admin", {
    title: "admin",
  });
});

router.get("/admin/dashboard", (req, res) => {
  res.render("dashboard", {
    title: "Admin dashboard page",
    // isAdmin: true,
    isDashboard: true,
  });
});
module.exports = router;
