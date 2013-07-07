var _ = require('underscore');
var util = require('util');
var path = require('path');
var fs = require('fs');
var _DEBUG = false;

/* ************************************
 * 
 * ************************************ */

/* ******* CLOSURE ********* */

/* ********* EXPORTS ******** */

module.exports = function (ctx, helpers, output) {
	helpers = _.sortBy(helpers, 'weight');
	if (_DEBUG) console.log('helpers: %s', util.inspect(_.pluck(helpers, 'name')));

	return _.reduce(
		helpers,
		function (tasks, helper) {
			if (!helper.respond) {
				throw new Error(util.format('helper without response method: %s', util.inspect(helper)));
			}
			tasks.push(function (ctx, output, cb) {
				if (_DEBUG) console.log('helper %s output', helper.name, util.inspect(output));

				if (helper.test && (!helper.test(ctx, output))) {
					return cb(null, ctx, output);
				}
				var safety = setTimeout(function(){
					throw new Error('taking too much time: helper ' + util.inspect(helper, false, 0));
				}, helper.timeout ? helper.timeout :  4000);
				helper.respond(ctx, output, function(err){
					clearTimeout(safety);
					cb(err, ctx, output);
				});
			});
			return tasks;
		}, [ function (cb) {
			cb(null, ctx, output);
		}]);
};