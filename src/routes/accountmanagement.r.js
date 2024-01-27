const express = require("express");
const router = express.Router();
const accountController = require('../controllers/account.c');

router.post('/getAccount', accountController.getAccounts);
router.post('/updateAccount', accountController.updateAccount);
router.post('/deleteAccount', accountController.deleteAccount);
router.post('/addAccount', accountController.addAccount);

module.exports = router;