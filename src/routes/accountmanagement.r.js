const express = require("express");
const router = express.Router();
const accountController = require('../controllers/account.c');

router.get('/getAccounts', accountController.getAccounts);
router.post('/updateAccount', accountController.updateAccount);
router.post('/deleteAccount', accountController.deleteAccount);
router.post('/addAccount', accountController.addAccount);
//Images
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/users'); // Thư mục lưu trữ file
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), function (req, res, next) {
    if (!req.file) {
        res.json(false);
        return;
    }
    const filename = req.file.filename;
    res.json({ filename: filename });
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