const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const authController = require('../controllers/authController');

const router = express.Router();

// All feedback routes are protected/authenticated
router.use(authController.protect);

router.post('/', feedbackController.createFeedback);
router.get('/contractor/:contractorId', feedbackController.getContractorFeedbacks);

module.exports = router;
