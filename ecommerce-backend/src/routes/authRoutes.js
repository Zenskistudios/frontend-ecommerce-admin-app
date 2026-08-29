const express = require('express');
const { login } = require('../controllers/authController');
const { loginValidationRules, validate } = require('../middleware/validate');

const router = express.Router();

router.post('/login', loginValidationRules, validate, login);

module.exports = router;
