const express = require('express');
const analysisController = require('../controllers/analysisController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes under this route file
router.use(authController.protect);

router.route('/')
  .post(analysisController.saveAnalysis)
  .get(analysisController.getAnalyses);

module.exports = router;
