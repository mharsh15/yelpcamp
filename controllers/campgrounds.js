//models

const Campground = require('../models/campground')
//cloudinary for image uploads
const { cloudinary } = require("../cloudinary/cloudinary")
//for maps
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapboxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapboxToken })

function geoStrToNum(num) {
	//var floor = parseFloat;
	return parseFloat(num)
}

module.exports.index = async function (req, rep) {
	const campground = await Campground.find()

	rep.render('campground/index', { campground })

}
//renders form to create a new campground
module.exports.new = (req, rep) => {
	rep.render('campground/new')

}

//function handeling post rout for creating new form
module.exports.createNewCampPost = async (req, rep) => {
	// if (!req.body.campground) { throw new ExpressError("EH WHere is the data", 400) }

	const newCamp = Campground({ ...req.body.campground })
	newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
	const userGeo = req.body.campground.location
	//geocode	
	// const responseGeo = await geocoder.forwardGeocode(
	// 	{
	// 		query: userGeo,
	// 		limit: 1
	// 	}).send()

	//console.log(responseGeo.body.features[0].geometry.coordinates)


	var longitude = geoStrToNum(req.body.campground.geometry.longitude)
	var latitude = geoStrToNum(req.body.campground.geometry.latitude)
	newCamp.geometry = { type: "Point", coordinates: [longitude, latitude] }
	newCamp.author = req.user.id
	//for saving geoJSON
	//newCamp.geometry = responseGeo.body.features[0].geometry
	await newCamp.save()
	//console.log(newCamp)
	req.flash('success', "successfully made a new campground")
	rep.redirect("/campground")
}

///show individual camp
module.exports.showIndividualCamp = async (req, rep) => {

	const camp = await Campground.findById(req.params.id).populate(
		{
			path: 'reviews',
			populate:
			{
				path: "author"
			}

		}).populate('author')
	console.log(camp)
	if (!camp) {
		req.flash('error', 'Cannot Find campground')
		rep.redirect("/campground")
	}
	else {
		rep.render('campground/show', { camp })
		//console.log(camp)
	}

}
//shows / renders edit page for a particular campground
module.exports.showEditPage = async (req, rep) => {
	let { id } = req.params

	let camp = await Campground.findById(id)
	if (!camp) {
		req.flash('error', 'Cannot Find campground')
		rep.redirect("/campground")
	}
	console.log("CAMPGROUND EDIT", camp)
	rep.render("campground/update", { camp })


}
////update a given camp
module.exports.updateCampground = async (req, rep) => {

	let { id } = req.params
	//let camp = Campground.findById(id)
	let camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
	const newImages = req.files.map(f => ({ url: f.path, filename: f.filename }))
	camp.images.push(...newImages)
	let { deleteImages } = req.body

	if (deleteImages) {
		for (let filename of deleteImages) {
			cloudinary.uploader.destroy(filename)
		}
		console.log("DELETE IMAGE", deleteImages)
		await camp.updateOne({ $pull: { images: { filename: { $in: deleteImages } } } })
		console.log("DELETE IMAGE", camp)
	}
	//const userGeo = req.body.campground.location

	// //geocode	
	// const responseGeo = await geocoder.forwardGeocode(
	// 	{
	// 		query: userGeo,
	// 		limit: 1
	// 	}).send()

	//camp.geometry = responseGeo.body.features[0].geometry
	var longitude = geoStrToNum(req.body.campground.geometry.longitude)
	var latitude = geoStrToNum(req.body.campground.geometry.latitude)
	camp.geometry = { type: "Point", coordinates: [longitude, latitude] }
	await camp.save()
	//console.log("UPDATE: ", req.body)
	req.flash('success', "successfully updated campground")
	//await Campground.findByIdAndUpdate()
	rep.redirect(`/campground/${id}`)
}

//delete a campground
module.exports.deleteCampground = async (req, rep) => {
	let { id } = req.params
	let camp = await Campground.findById(id)

	await Campground.findByIdAndDelete(id)
	for (let img of camp.images) {
		cloudinary.uploader.destroy(img.filename)
	}

	req.flash('success', "successfully deleted campground")
	rep.redirect("/campground")

}