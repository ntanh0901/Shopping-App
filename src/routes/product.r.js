const express = require("express");
const router = express.Router();
const categoriesController = require('../controllers/categories.c');
const productController = require('../controllers/product.c');

// Categories
router.post('/getCategories', categoriesController.getCategories);
router.get('/updateCategories', categoriesController.updateCategories);
router.get('/deleteCategories', categoriesController.deleteCategories);

module.exports = router;