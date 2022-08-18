module.exports = function catchAsync(fn) {
	return function (req, rep, next) {
		fn(req, rep, next).catch(next)
	}
}