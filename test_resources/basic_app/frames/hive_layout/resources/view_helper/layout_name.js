var _ = require('underscore');
var util = require('util');
var path = require('path');
var _DEBUG = false;

var mvc_path = path.resolve(__dirname, './../../../../../../index');
var mvc = require(mvc_path);

module.exports = function (cb) {

	var helper = {
		name: 'layout_name',

		test: function (ctx, output) {
			return ctx.$action.get_config('layout_name');
		},

		weight: 100,

		respond: function (ctx, output, cb) {
			console.log('arguments to layout_name: %s', util.inspect(arguments));
		 var lm =	mvc.Model.list.get('$layouts');
			lm.get(output.layout_name, function(err, layout){
				if(!output.layout_name){
					output.$layout_name = ctx.$action.get_config('layout_name');
				}

				cb(null, ctx, output);
			})
		}
	};

	cb(null, helper);
};