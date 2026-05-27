const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.patch('/updateMe', userController.updateMe);
router.get('/', userController.getUsers);

module.exports = router;
