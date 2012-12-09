var _ = require('underscore');
var Context = require('./../context');
var Resource = require('./../resource');
var async = require('async');
var util = require('util');
var _DEBUG = false;

module.exports = function (req, res, next) {
	var self = this;
	var ctx = Context(req, res, this);

	this.ready(ctx, function (err, ready) {
		if (err) {
			return next(err, ctx);
		} else if (!ready) {
			return ctx.$sendfile(__dirname + 'not_ready.html')
		}
		self.respond(ctx, function (err, ctx, output) {
			if (!ctx){
				throw new Error('no context');
			}
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
					Resource.list.find({TYPE: 'view_helper'}, function (err, helpers) {
						ctx.$phases.push('view_helpers');
						var waterfall_tasks = [
							function (cb) {
								cb(null, ctx, output);
							}
						];

						if (_DEBUG) console.log('VIEW HELPERS: data %s', util.inspect(Resource.list.data));

						_.each(helpers, function (helper) {

							if (helper.test && !helper.test(ctx, output)) {
								return;
							}
							if (!helper.respond){
								console.log('view helper with no respond method: %s', util.inspect(helper));
								return;
							}

							waterfall_tasks.push(function (ctx, output, cb) {

								helper.respond(ctx, output, cb);
							})
						});

						async.waterfall(waterfall_tasks, function (err, ctx, output) {
							if (err) {
								self.emit('req_error', ctx, err, next);
							} else {
								ctx.$render(ctx.$template, output);
							}
						})

					});
				} else {
					ctx.$send(output);
				}

			} else {
				ctx.$send(200, output);
			}

		})
	})

};