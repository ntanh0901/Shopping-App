const express = require('express');
const router = express.Router();
const controller = require('../controllers/payment.c');
router.use(express.json());

router.get('/getBalance', controller.authenticateToken, controller.getBalance);
router.post('/getAccessToken', controller.getAccessToken);
router.post('/token', controller.getNewAccessToken);
router.delete('/logout', controller.deleteRefreshToken);
router.get('/returnBill', controller.returnBill);


module.exports = router;
