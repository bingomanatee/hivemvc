var _ = require('underscore');
var async = require('async');
var util = require('util');
var _DEBUG = false;

module.exports = function (apiary) {

	return function (req, res, next) {
		var self = this;
		var ctx = apiary.Context(req, res, this);

		this.ready(ctx, function (err, ready) {
				if (err) {
					return next(err, ctx);
				} else if (!ready) {
					return ctx.$sendfile(__dirname + 'not_ready.html')
				}
				self.respond(ctx, function (err, ctx, output) {
					if (err) {
						if (err.message == 'unready') {
							return ctx.$sendfile(__dirname + 'not_ready.html');
						} else if (self.on_error) {
							self.on_error(err, ctx, next)
						} else {

							next(err, ctx);
						}
					} else if (_.isObject(output)) {
						if (ctx.$template) {
							apiary.Resource.list.find({TYPE: 'view_helper', post: false})
								.sort('weight', function (err, helpers) {
									ctx.$phases.push('view_helpers');
									var waterfall_tasks = _.reduce(
										helpers,
										function (tasks, helper) {
											if (!helper.respond) {
												throw new Error(util.format('helper without response method: %s', util.inspect(helper)));
											}
											tasks.push(function (ctx, output, cb) {
												if (helper.test && (!helper.test(ctx, output))) {
													return cb(null, ctx, output);
												}
												helper.respond(ctx, output, cb);
											});
											return tasks;
										}, [ function (cb) {
											cb(null, ctx, output);
										}]);

									async.waterfall(waterfall_tasks, function (err, ctx, output) {
										if (err) {
											self.emit('req_error', ctx, err, next);
										} else {
											ctx.$render(ctx.$template, output);
										}
									})

								}
							)
							;
						} else {
							ctx.$send(output);
						}

					}
					else {
						ctx.$send(200, output);
					}

				})
			}
		)

	}
};
