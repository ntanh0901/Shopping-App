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
  });
});

router.get("/admin/report", (req, res) => {
  res.render("report", {
    title: "Admin dashboard page",
    // isAdmin: true,
    isReport: true,
  });
});

router.get("/admin/categories", (req, res) => {
  res.render("categories", {
    title: "Admin categories",
    // isAdmin: true,
    isCategories: true,
  });
});

module.exports = router;
