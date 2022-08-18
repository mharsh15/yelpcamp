const { ref } = require("joi")
const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
	rating: {
		type: Number
	},
	body: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
})

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review