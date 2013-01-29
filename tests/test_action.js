var hmvc = require('./../index');

var Action = hmvc.Action;
var Context = hmvc.Context;
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var _DEBUG = false;

//@TODO: update action tests

if (false) {
	tap.test('going postal', function (t) {
		var action = Action({
			on_post_process: function (ctx, cb) {
				ctx.tags = ['alpha', 'beta', 'gamma'];
				cb(null, ctx);
			}
		});
		action.init(function () {
			action.respond({'$req': {method: 'post'}, 'out': {}}, function (err, ctx2, output) {
				t.deepEqual(ctx2.tags, ['alpha', 'beta', 'gamma'], 'got to post process');
				t.end();
			})
		});
	})
}

var _total_action = {

	on_validate: function (ctx, cb) {
		if (!ctx.charges) {
			cb('No charges');
		} else {
			cb(null, ctx);
		}
	},

	on_process: function (ctx, cb) {
		var error = false;
		var total = _.reduce(ctx.charges, function (v, charge) {
				if (error) {
					return;
				}
				if (!_.isNumber(charge.value)) {
					error = 'isNaN(' + (charge.value ? charge.value : 'value') + ')';
				} else if (charge.value >= 0) {
					v += charge.value;
				} else {
					error = 'invalid charge: ' + charge.value;
				}
				return v;
			},
			0);
		if (error) {
			cb(error, ctx);
		} else {
			ctx.out.set('value', total);
			cb(null, ctx);
		}
	}
};

if (false) {
	tap.test('errors in action', function (t) {
		var action = Action(_total_action, {});

		action.init(function () {
			var res = {$send: function (err, send) {
				console.log('err: %s, output: %s', util.inspect(err), util.inspect(output));
				t.end();
			}};

			var req = {url: 'foo', method: 'get'};
			action.request(req, res, function (err, ctx, output) {
				console.log('next err: %s, ctx: %s,  output: %s', util.inspect(err), util.inspect(ctx, false, 0), util.inspect(output));
				t.equals(err.message, 'No charges', 'message: no charges');
				t.equals(ctx.$phase(), 'validate', 'exited in validate');
				action.on_error = function (err, ctx, next) {
					if (err.message == 'No charges') {
						ctx.$flash('error', 'You must enter charges');
						ctx.$go('/charges');
					} else {
						next(err, ctx);
					}
				};

				var res = {$send: function (err, send) {
					console.log('err: %s, output: %s', util.inspect(err), util.inspect(output));
					t.end();
				}, redirect:      function (url) {
					t.equal(url, '/charges', 'redirect');
					t.end();
				}};

				var req = {url: 'foo', method: 'get', flash: function (type, msg) {
					t.equal(type, 'error', 'request flash type');
					t.equal(msg, 'You must enter charges', 'request flash message');
				}};

				action.request(req, res, function (err, ctx, output) {
					console.log('shouldnt reach next');
					t.end();
				})
			})
		});
	});
}