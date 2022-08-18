
const express = require("express")
//middleware to check user, access permissions
const { isLoggedIn, validateCampround, validateCampgoundOwner } = require("../middleware")
const router = express.Router()
//for put/delete request
const methodOverride = require('method-override')
const campgroundFunctions = require("../controllers/campgrounds")
//models
const Campground = require('../models/campground')

//
//custom express error class
const ExpressError = require('../utils/ExpressError')
const catchAsync = require("../utils/catchAsync")

//joi schema
const { campgroundSchemaJOI, reviewSchemaJOI } = require('../schemas/joiSchema')

//for adding image 
const multer = require('multer')
const { storage } = require("../cloudinary/cloudinary")
const upload = multer({ storage })

//middleware for checking whether user is logged in




//routes
router.route("/")
	.get(catchAsync(campgroundFunctions.index))
	//route handles creation of new camp - POST
	.post(isLoggedIn, upload.array("campground[image]"), catchAsync(campgroundFunctions.createNewCampPost))

//edit camp ground
router.get("/new", campgroundFunctions.new)

//shows info of camp
router.route("/:id")
	.get(catchAsync(campgroundFunctions.showIndividualCamp))

	//updating existing camp
	.put(isLoggedIn, validateCampgoundOwner, upload.array("campground[image]"), catchAsync(campgroundFunctions.updateCampground))
	//deleting 
	//deleting camp
	.delete(isLoggedIn, validateCampgoundOwner, catchAsync(campgroundFunctions.deleteCampground))
///post+PUT+Delete routes


//renders page to edit an existing campground
router.get("/:id/update", isLoggedIn, validateCampgoundOwner, catchAsync(campgroundFunctions.showEditPage))







module.exports = router