const express = require("express");
const router = express.Router();

const billController = require('../controllers/bill.c');

router.get('/bestselling', billController.bestselling);
router.get('/categoriesStatistics', billController.categoriesStatistics);
router.get('/currentRevenue', billController.currentRevenue);

module.exports = router;