var util = require('util');

module.exports = {

	on_validate: function (context, cb){

		if (!((context.hasOwnProperty('key')) && (context.hasOwnProperty('value')))){
			console.log('err - key, value, %s', util.inspect(this));
			cb('must provide key and value', context);
		}
		cb (null, context);
	},

	on_process: function (context, cb) {
		context.$session_set(context.key, context.value);
		cb(null, context);
	},

	on_output: function (context, cb) {
		var out = {key: context.key, value: context.$session(context.key)};
		console.log('outputting %s', util.inspect(out));
		context.$out.setAll(out);
		cb();
	}

}