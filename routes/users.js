
const express = require("express")
const router = express.Router()

const catchAsync = require("../utils/catchAsync")
const passport = require('passport')
//controller module
const userController = require("../controllers/usersController")

//ROUTES
// for rendering page to create a user
router.get("/register", userController.createRegisterUserPage)

//for registering a user
router.post("/register", catchAsync(userController.createUser))

//route for logging in a user
router.get("/login", userController.createLoginPage)

//route for logging in user
router.post("/login", passport.authenticate('local',
	{ failureFlash: true, failureRedirect: "/login" }),
	userController.logInUser
)
//log our user from website
router.get("/logout", userController.userLogOut)

module.exports = router