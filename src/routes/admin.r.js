const express = require("express");
const router = express.Router();
const productRouter = require('./product.r');
const accountRouter = require('./accountmanagement.r');

// router.get("/", (req, res) => {
//   res.render("admin", {
//     title: "admin",
//     GioiTinh: "male",
//   });
// });

router.get("/", (req, res) => {
  if (req.user && req.user.LaAdmin === '1') {
    res.render("dashboard", {
      title: "Admin dashboard page",
      isDashboard: true,
    });
  }
  else res.redirect('/');
});

router.get("/report", (req, res) => {
  if (req.user && req.user.LaAdmin === '1') {
    res.render("report", {
      title: "Admin dashboard page",
      isReport: true,
    });
  }
  else res.redirect('/');

});

router.get("/categories", (req, res) => {
  if (req.user && req.user.LaAdmin === '1') {
    res.render("categories", {
      title: "Admin categories",
      isCategories: true,
    });
  }
  else res.redirect('/');
});

router.get("/products", (req, res) => {
  if (req.user && req.user.LaAdmin === '1') {
    res.render("products", {
      title: "Admin products",
      isProducts: true,
    });
  }
  else res.redirect('/');
});

router.get("/analysis", (req, res) => {
  if (req.user && req.user.LaAdmin === '1') {
    res.render("analysis", {
      title: "Admin analysis",
      isAnalysis: true,
    });
  }
  else res.redirect('/');
});

router.get("/users", (req, res) => {
  if (req.user && req.user.LaAdmin === '1') {
    res.render("users", {
      title: "Admin users",
      isUsers: true,
    });
  }
  else res.redirect('/');
});
router.use('/productsmanagement', productRouter);
router.use('/accountsmanagement', accountRouter);

module.exports = router;
