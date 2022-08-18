const User = require("../models/user")

//function renders login page
module.exports.createRegisterUserPage = (req, rep) => {
	rep.render("users/register")
}


//module helps in adding user to database
module.exports.createUser = async (req, rep) => {
	//rep.send(req.body)
	try {
		const { email, username, password } = req.body
		const user = new User({ email, username })
		const registered = await User.register(user, password)
		console.log(registered)
		req.login(registered, err => {
			if (err) return next(error)
			req.flash("success", "Welcome")
			rep.redirect("/campground")

		})

	}
	catch (error) {
		req.flash("error", error.message)
		rep.redirect('/register')
	}
}
//module helps in rendering page for logging in a user
module.exports.createLoginPage = (req, rep) => {

	rep.render("users/login")
}

//function helps in logging in an existing user
module.exports.logInUser = (req, rep) => {
	req.flash("success", "welcome Back")
	let originalUrl = req.session.originalUrl || "/campground"
	delete req.session.originalUrl
	rep.redirect(originalUrl)
}

//for logging out user
module.exports.userLogOut = (req, rep) => {
	req.logout()
	req.flash("success", "You are logged out")
	rep.redirect("/campground")
}