var _ = require('underscore');
var util = require('util');
var path = require('path');
var _DEBUG = false;

var mvc_path = path.resolve(__dirname, './../../../../../../index');
var mvc = require(mvc_path);

module.exports = function (cb) {

	var helper = {
		name: 'layout',

		test: function (ctx, output) {
			console.log('testing output %s for layout_name', util.inspect(output));
			return output.layout_name;
		},

		weight: 100,

		respond: function (ctx, output, cb) {
			console.log('arguments to layout: %s', util.inspect(arguments));

			var lm = mvc.Model.list('$layouts');
			lm.get(output.layout_name, function (err, layout) {
				debugger;
				if (layout) {
					var template = layout.get_config('template');
					if (template) {
						console.log('template = %s', template);
						output.layout = template;
					}
				} else {
					console.log('cannot find layout %s', output.layout_name);
				}

				cb(null, ctx, output);
			})
		}
	};

	cb(null, helper);
};