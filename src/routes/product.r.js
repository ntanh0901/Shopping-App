const express = require("express");
const router = express.Router();
const categoriesController = require('../controllers/categories.c');
const productController = require('../controllers/product.c');

// Categories
router.post('/getCategories', categoriesController.getCategories);
router.get('/updateCategories', categoriesController.updateCategories);
router.get('/deleteCategories', categoriesController.deleteCategories);
router.get('/addCategory', categoriesController.addCategory);

//Products
router.get('/getProducts', productController.getProducts);
router.get('/updateProduct', productController.updateProduct);
router.get('/deleteProduct', productController.deleteProduct);
router.get('/addProduct', productController.addProduct);
module.exports = router;