//for quick push of data
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const Cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

const mongoDbURL = 'mongodb+srv://mharsh15:WDNDTst203519@cluster0.hmmgj.mongodb.net/showcase?retryWrites=true&w=majority'
const localDB = 'mongodb://localhost:27017/yelp-camp'
const currentDB = mongoDbURL;

//initialising mongoose
mongoose.connect(currentDB,
	{ useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("Connected to MongoDB")
	})
	.catch(error => {
		console.log("Error connecting to mongoDB")
		console.log(error);

	})
const sample = array => array[Math.floor(Math.random() * array.length)]
const seedDB = async () => {
	await Campground.deleteMany({})
	for (let i = 0; i <= 300; i++) {
		const randomNum = Math.floor((Math.random() * 1000))
		const c = new Campground({
			location: `${Cities[randomNum].city}', '${Cities[randomNum].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			images: [
				{
					url: 'https://res.cloudinary.com/dmbt3twf5/image/upload/v1644372225/yelpcamp/Campground3_ybmdso.jpg',
					filename: 'yelpcamp/yelpcamp/Campground3_ybmdso'

				}
			],
			geometry:
			{
				type: "Point",
				coordinates: [Cities[randomNum].longitude, Cities[randomNum].latitude]
			},
			description: 'lorem Ipsum',
			price: Math.floor(Math.random() * 100 + 1),
			author: "620f37f0e81e8e7af06275b5"

		})

		await c.save()

	}

}

seedDB()
