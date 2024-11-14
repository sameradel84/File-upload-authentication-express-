const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
router.route("/register").post(authController.register)
router.route("/login").post(authController.login)
router.route("/refresh").get(authController.refresh)
router.route("/logout").post(authController.logout)
router.route("/forgot-password").post(authController.forgotPassword)
router.route("/reset-password").post(authController.resetPassword)

module.exports = router;



