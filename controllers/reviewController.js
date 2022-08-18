
const Campground = require('../models/campground')
const Review = require("../models/review")

//adds reviews to a particular camp - POST ROUTE
module.exports.addComments = async (req, rep) => {
	let { review } = req.body
	const { id } = req.params
	const newReview = new Review(review)
	newReview.author = req.user.id
	let campground = await Campground.findById(id)
	campground.reviews.push(newReview)
	await newReview.save()
	let camp = await campground.save()
	console.log(camp)
	req.flash('success', 'Created New Review!!')
	rep.redirect(`/campground/${id}`)
}
//delets a particular review
module.exports.deleteComments = async (req, rep) => {
	let { reviewId } = req.params
	let { id } = req.params

	await Campground.findByIdAndUpdate({ _id: id }, { $pull: { reviews: reviewId } })
	await Review.findByIdAndDelete(reviewId)
	req.flash('success', "successfully deleted review")
	rep.redirect(`/campground/${id}`)
	//rep.send(`deleted ${id}`)
}