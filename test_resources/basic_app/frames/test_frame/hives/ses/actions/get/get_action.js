module.exports = {

	on_validate: function (context, cb) {
		if (!((context.hasOwnProperty('key')))) {
			cb('must provide key', context);
		}
		cb(null, context);
	},

	on_process: function (context, cb) {
		context.$out.set('value', context.$session(context.key));
		cb(null, context);
	},

	on_output: function (context, cb) {
		cb(null, context, context.$out.data);
	}

};