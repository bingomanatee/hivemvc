module.exports = {

	on_output: function (context, cb) {
		cb(null, context, {action: 'foo', response: 2})
	}

}