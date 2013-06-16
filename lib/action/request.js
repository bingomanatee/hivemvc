var _ = require('underscore');
var async = require('async');
var util = require('util');
var _DEBUG = false;
var Configuration = require('hive-configuration');
var _filter_view_helpers = require('./filter_view_helpers');

function _on_template(ctx, apiary, output, next) {
	apiary.Resource.list.find({TYPE: 'view_helper', post: false})
		.sort('weight', function (err, helpers) {

			var waterfall_tasks = _filter_view_helpers(ctx, helpers, output);

			async.waterfall(waterfall_tasks, function (err, c, output) {
				if (err) {
					apiary.emit('req_error', ctx, err, next);
					next(err);
				} else {
					ctx.$render(ctx.$template, output, next);
				}
			})

		});
}

function _on_err(err, ctx, apiary, next) {
	switch (err.message) {
		case 'redirect':
			break;
		case 'json':
			break;
		case 'unready':
			ctx.$sendfile(__dirname + 'not_ready.html');
			break;

		default:
			if (this.on_error) {
				this.on_error(err, ctx, next)
			} else {
				next(err, ctx);
			}
	}
}

function _on_respond(err, ctx, apiary, next) {
	if (err) {
		_on_err(err, ctx, apiary, next);
	} else {
		var output = (ctx.$out instanceof Configuration) ? ctx.$out.valueOf() : ctx.$out.toJSON ? ctx.$out.toJSON() : ctx.$out;
		if (_.isObject(output) && ctx.$template) {
			_on_template(ctx, apiary, output, next);
		} else {
			ctx.$send(200, output);
		}
	}
}

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
				self.respond(ctx, function (err) {
					_on_respond(err, ctx, apiary, next);
				});
			}
		);
	}
};
