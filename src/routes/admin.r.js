const express = require("express");
const router = express.Router();
const productRouter = require('./product.r');

router.get("/", (req, res) => {
  res.render("admin", {
    title: "admin",
    GioiTinh: "male",
  });
});

router.get("/dashboard", (req, res) => {
  res.render("dashboard", {
    title: "Admin dashboard page",
    isDashboard: true,
  });
});

router.get("/report", (req, res) => {
  res.render("report", {
    title: "Admin dashboard page",
    isReport: true,
  });
});

router.get("/categories", (req, res) => {
  res.render("categories", {
    title: "Admin categories",
    isCategories: true,
  });
});

router.get("/products", (req, res) => {
  res.render("products", {
    title: "Admin products",
    isProducts: true,
  });
});

router.get("/analysis", (req, res) => {
  res.render("analysis", {
    title: "Admin analysis",
    isAnalysis: true,
  });
});

router.get("/users", (req, res) => {
  res.render("users", {
    title: "Admin users",
    isUsers: true,
  });
});
router.use('/productsmanagement', productRouter);

module.exports = router;
