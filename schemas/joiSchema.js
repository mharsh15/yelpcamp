const joi = require('joi')
module.exports.campgroundSchemaJOI = joi.object({
	campground: joi.object({
		title: joi.string(),
		price: joi.number().min(0),
		image: joi.string().required(),
		location: joi.string().required(),
		description: joi.string().required()
	}).required()
})


module.exports.reviewSchemaJOI = joi.object({

	review: joi.object({
		rating: joi.number().required().min(0),
		body: joi.string().required()

	}).required()


})