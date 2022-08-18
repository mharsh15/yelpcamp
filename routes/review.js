const express = require("express")
const router = express.Router({ mergeParams: true })

//custom express error class

const ExpressError = require('../utils/ExpressError')
const catchAsync = require("../utils/catchAsync")

//Review Controller
const reviewController = require("../controllers/reviewController")

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware")



//routes
//post route for adding reciew to reviews and add comments section to particular 
router.post("/", isLoggedIn, validateReview, catchAsync(reviewController.addComments))

//deleting review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteComments))

module.exports = router