var async = require('async');
var _ = require('underscore');
var path = require('path');
var _DEBUG = true;
var util = require('util');

module.exports = function (template, output) {
	var self = this;
	var apiary = this.$apiary;

	if (_DEBUG){
		var args = _.toArray(arguments);
		console.log('render args: %s', util.inspect(args, true, 1));
	}

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
			if (_DEBUG){
				var args = _.toArray(arguments);
				console.log('render (err, ctx, output, html) args: %s', util.inspect(args, true, 1));
			}
			self.$res.send(html);
		});

	})
}