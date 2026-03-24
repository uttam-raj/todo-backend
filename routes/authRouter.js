const express = require('express');
const authController = require("../controllers/authController");
const {loginSchema,signupSchema} = require('../Validator/auth-validator');
const validator = require('../Middlewares/validate-middleware');

const router = express.Router();

router.route("/login").post(validator(loginSchema), authController.login);
router.route("/register").post(validator(signupSchema), authController.register);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword").post(authController.resetPassword);
router.route("/verifiedOtp").post(authController.verifyOtp);

module.exports = router;