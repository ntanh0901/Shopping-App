const express = require("express");
const router = express.Router();
const categoriesController = require('../controllers/categories.c');
const productController = require('../controllers/product.c');
const fs = require('fs').promises;
const path = require('path');

// Categories
router.post('/getCategories', categoriesController.getCategories);
router.post('/updateCategories', categoriesController.updateCategories);
router.post('/deleteCategories', categoriesController.deleteCategories);
router.post('/addCategory', categoriesController.addCategory);

//Products
router.post('/getProducts', productController.getProductsAdmin);
router.post('/updateProduct', productController.updateProduct);
router.post('/deleteProduct', productController.deleteProduct);
router.post('/addProduct', productController.addProduct);

//Images
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/products'); // Thư mục lưu trữ file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({ storage: storage })

router.post('/upload', upload.array('input24[]'), function (req, res, next) {
    const filenames = req.files.map(file => file.filename);
    res.json({ filenames: filenames });
});

router.post('/removeImage', async (req, res) => {
    try {
        const deleteImgPath = req.body.imgs;
        const baseDirectory = path.join(__dirname, '../../public');
        for (let i = 0; i < deleteImgPath.length; i++) {
            const absolutePath = path.join(baseDirectory, deleteImgPath[i]);
            // console.log(absolutePath);
            await fs.unlink(absolutePath);
        }
        res.json(true);
    }
    catch (err) {
        console.log("Router removeImage error: ", err);
        res.json(false);
    }
})
module.exports = router;