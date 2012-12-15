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
			return output.layout_name;
		},

		weight: 95,

		respond: function (ctx, output, cb) {
			var lm = mvc.Model.list.get('$layouts');
			lm.get(output.layout_name, function (err, layout) {
				if (layout) {
					var layout_js = layout.get_config('javascript', []);
				} else {
					console.log('cannot find layout %s', output.layout_name);
				}

				cb(null, ctx, output);
			})
		}
	};

	cb(null, helper);
};