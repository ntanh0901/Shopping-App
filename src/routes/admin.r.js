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
    isDashboard: true,
  });
});

router.get("/admin/report", (req, res) => {
  res.render("report", {
    title: "Admin dashboard page",
    isReport: true,
  });
});

router.get("/admin/categories", (req, res) => {
  res.render("categories", {
    title: "Admin categories",
    isCategories: true,
  });
});

router.get("/admin/products", (req, res) => {
  res.render("products", {
    title: "Admin products",
    isProducts: true,
  });
});

router.get("/admin/analysis", (req, res) => {
  res.render("analysis", {
    title: "Admin analysis",
    isAnalysis: true,
  });
});

router.get("/admin/users", (req, res) => {
  res.render("users", {
    title: "Admin users",
    isUsers: true,
  });
});
module.exports = router;
