const { required } = require('joi')
const mongoose = require('mongoose')
const Review = require('./review')
const review = require('./review')
const Schema = mongoose.Schema

const ImageSchema = new Schema(
	{
		url: {
			type: String

		},
		filename: {
			type: String
		}
	}

)
//creates non database - for image
ImageSchema.virtual('thumbnail').get(function () {
	//console.log("in virtuals function")
	return this.url.replace("/upload", "/upload/w_100")

})

const CampgroundSchema = new Schema({
	title: String,
	price: Number,
	geometry: {
		type:
		{
			type: String,
			enum: ["Point"],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}

	},
	images: [
		ImageSchema
	],
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [{
		type: Schema.Types.ObjectId,
		ref: "Review"
	}]
}, { toJSON: { virtuals: true } })
//creates non database - for 
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
	//console.log("in virtuals function")
	//return `<a href="/campground/${this._id}">${this.title}</a>`
	return { id: this._id, title: this.title }
})
CampgroundSchema.post('findOneAndDelete', async (camp) => {
	console.log("GRRRR DELETED")
	if (camp)
		await Review.remove({
			_id: {
				$in: camp.reviews
			}
		})
})


module.exports = mongoose.model("Campground", CampgroundSchema)