//setting up env
if (process.env.NODE_ENV !== "production") {
	require('dotenv').config()
}
const express = require('express')
const mongoose = require('mongoose')

//layout packages
const ejsMate = require('ejs-mate')
const path = require('path')

//for put/delete request
const methodOverride = require('method-override')

//routes initialization
const campgroundRoutes = require("./routes/camprgounds");
const reviewRoutes = require("./routes/review")
const userRoutes = require("./routes/users")
//for server side form validation
const joi = require('joi')

//for session
const expressSession = require("express-session")
//storing session in mongo since in production one cant
const ConnectMongo = require("connect-mongo")

// //custom express error class
const ExpressError = require('./utils/ExpressError')

//for posting messages
const flash = require("connect-flash")

//for login we use passport
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

//for sanitizing mongoose request
const sanitizing = require('express-mongo-sanitize')

///for sanitizing xss 
const helmet = require("helmet")
const { env } = require('process')



//**********internal middlewares******************* 


//initialising
const app = express()

//setting
app.set('view engine', 'ejs')
app.set('path', path.join(__dirname, 'views'))




//middleware - as Utility
//the below middleware helps in pulling data from header form
//without the below line earer forms cannot be parsed
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)

//flash
app.use(flash())


//for accessing public directory
app.use(express.static(path.join(__dirname, 'public')))

//for sanitizing mongoose
app.use(sanitizing())
//initialising mongoose
//
const mongoDbURL = process.env.MONGOATLAS
const localDB = 'mongodb://localhost:27017/yelp-camp'
const currentDB = mongoDbURL;
mongoose.connect(currentDB,
	{})
	.then(() => {
		console.log("Connected to MongoDB")
	})
	.catch(error => {
		console.log("Error connecting to mongoDB")
		console.log(error);

	})

//for session management

const store = new ConnectMongo({
	mongoUrl: currentDB,
	secret: process.env.MONGOCONNECT,
	touchAfter: 24 * 60 * 60 //it will update every 24 hrs
})
//for errors
store.on("error", function (e) {
	console.log("SESSION STORE ERROR", e)
})

const envSecret = process.env.secret || 'thisshouldbeabettersecret'
const sessionConfig =
{
	name: "session",
	store,
	secret: envSecret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	},
	mcode: { uname: "haha" }
}


app.use(expressSession(sessionConfig))


///for initializing passport
app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
//for adding user to session
passport.serializeUser(User.serializeUser())
//to lgo off user
passport.deserializeUser(User.deserializeUser());

//for displaying message if any
app.use((req, rep, next) => {

	rep.locals.currentUser = req.user
	rep.locals.success = req.flash('success')
	rep.locals.error = req.flash('error')
	next()

})
// //middleware
// app.use('view-engine', 'ejs')

//***************routes***************************///////


app.get("/", function (req, rep) {
	rep.render('home')

})

//routes initialization

app.use("/campground", campgroundRoutes)
app.use("/campground/:id/review", reviewRoutes)
app.use("/", userRoutes)

//for all app
app.all('*', (req, rep, next) => {

	next(new ExpressError("HMM THere is no page like this", 404))

})
//error handeling middleware
app.use((err, req, rep, next) => {
	let { statusCode = 500, } = err
	if (!err.message) err.message = "oh Something went wrong"

	rep.status(statusCode).render("error_template/error", { err })
	//rep.send(`Oh Boy, something happened`)
})

//listen - for heroku
const port = process.env.PORT || 3017
app.listen(port, function () {
	console.log("Port 3017 for Yelp Camp up and running")

})