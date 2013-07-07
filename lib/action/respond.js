var async = require('async');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

var _default_pipes = ['validate', 'input', 'process', 'output'];

var response_count = 0;
module.exports = function (context, output_callback) {
	var incident = ++response_count;
	var method = context.$req.method.toLowerCase();
	var self = this;
	this.emit('log', 'debug', util.format('responding to %s with action %s (# %s)', context.$req.url, this.$path, incident));

	function _choose_method(fname) {
		var handler_name = util.format('on_%s_%s', method, fname);
		var short_name = util.format('on_%s', fname);

		var chosen_handler = 'default_' + method;

		var f = _.reduce([short_name, handler_name], function (out, name) {
			if (self[name]) {
				chosen_handler = name;
				return self[name];
			} else {
				return out;
			}
		}, function (ctx, cb) {
			cb();
		}, self);

		return {
			handler:      f,
			handler_name: chosen_handler
		}
	}

	function _failsafe_time() {
		var apiary = self.get_config('apiary');
		return self.get_config('handler_failsafe_time') || apiary.get_config('action_handler_failsafe_time') || 4000;
	}

	var waterfall_functions = _.map(_default_pipes, function (fname) {

		var choice = _choose_method(fname);
		var sig = util.format(' method: %s action %s|handler %s # %s ',
			method,	self.$path, choice.handler_name, incident);

		return function (inner_callback) {
			var failsafe_time = _failsafe_time();
			var failsafe = false;

			var sto = setTimeout(function () {
				failsafe = true;
				var message = util.format('%s took longer than %s MS'
					, sig,  failsafe_time);

				self.emit('log', 'error', message);
				inner_callback(new Error(message));
			}, failsafe_time);

			self.emit('log', 'debug', util.format('started %s ',
				 sig));

			_.bind(choice.handler, self)(context, function (err) {
				if (!failsafe) {
					clearTimeout(sto);
					if (err) {
						if ((err == 'redirect') || (err.message == 'redirect')) {
							return inner_callback(err);
						}
						self.emit('log', 'error', util.format( 'action %s  error: %s',
							sig,  _.isString(err) ? err : err.message));
						inner_callback(err);
					} else {
						self.emit('log', 'debug', 'completed ' + sig);
						inner_callback();
					}
				}
			});
		}

	});

	async.waterfall(waterfall_functions, function (err) {
		if (err && _.isString(err)) {
			err = new Error(err);
		}
		output_callback(err);
	});
};