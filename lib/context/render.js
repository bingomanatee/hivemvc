var async = require('async');
var _ = require('underscore');
var path = require('path');
module.exports = function (template, output) {
	var self = this;
	var apiary = this.$apiary;

	apiary.Resource.list.find({TYPE: 'view_helper', post: true}).sort('weight', function(err, post_helpers){

		var tasks = _.reduce([
			function (cb) {
				self.$res.render(template, output, function (err, html) {
					cb(err, self, output, html);
				})
			}].concat(post_helpers),
			function (tasks, helper) {
				tasks.push(function () {
					var arg = _.toArray(arguments);
					helper.respond ? helper.respond.apply(helper, arg) : helper.apply(helper, arg);
				});
				return tasks;
			}, []);

		async.waterfall(tasks, function (err, ctx, output, html) {
			ctx.$res.send(html);
		});

	})
}