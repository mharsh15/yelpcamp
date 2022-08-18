const Campground = require('./models/campground')
const Review = require("./models/review")
const { campgroundSchemaJOI, reviewSchemaJOI } = require('./schemas/joiSchema')
//custom express error class
const ExpressError = require('./utils/ExpressError')

module.exports.isLoggedIn = (req, rep, next) => {
	if (!req.isAuthenticated()) {
		req.session.originalUrl = req.originalUrl
		req.flash('error', 'you must be signed in')
		return rep.redirect("/login")
	}
	console.log("from MIDDLEWARE", req.user)
	next()
}

///middleware for validation
module.exports.validateCampround = (req, rep, next) => {

	console.log(req.body.campground)
	let { error } = campgroundSchemaJOI.validate(req.body)
	if (error) {
		let msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)

	}
	else { next() }

}
//middleware to check whether its author/owner of campground who is doing things
module.exports.validateCampgoundOwner = async (req, rep, next) => {
	const { id } = req.params
	const camp = await Campground.findById(id)
	if (camp.author.equals(req.user.id)) {
		console.log(true)
		return next()
	}
	req.flash('error', "No user permission to access campground")
	rep.redirect(`/campground/${id}`)

}

//middleware for validating Schema
module.exports.validateReview = function (req, rep, next) {


	let { error } = reviewSchemaJOI.validate(req.body)
	if (error) {
		let msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg, 400)

	}
	else next()

}

//middleware for reviewer
module.exports.isReviewAuthor = async function (req, rep, next) {


	const { id, reviewId } = req.params
	const review = await Review.findById(reviewId)
	if (review.author.equals(req.user.id)) {
		console.log(true)
		return next()
	}
	req.flash('error', "No user permission to access campground")
	rep.redirect(`/campground/${id}`)

}

