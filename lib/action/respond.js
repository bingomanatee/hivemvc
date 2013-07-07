var async = require('async');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

var _default_pipes = ['validate', 'input', 'process', 'output'];

module.exports = function (context, output_callback) {

	var method = context.$req.method.toLowerCase();
	var self = this;
	if (_DEBUG) console.log('responding with action %s keys %s', this.get_config('root'), util.inspect(_.keys(this)));

	function _choose_method(fname){
		var handler_name = util.format('on_%s_%s', method, fname);
		var short_name = util.format('on_%s', fname);

		var chosen_handler = 'default_' + method;

		var f = _.reduce([short_name, handler_name], function(out, name){
			if (self[name]){
				chosen_handler = name;
				return self[name];
			} else {
				return out;
			}
		}, function (ctx, cb) {
			cb();
		}, self);

		return {
			handler: f,
			handler_name: chosen_handler
		}
	}

	function _failsafe_time(){
		var apiary = self.get_config('apiary');
		return self.get_config('handler_failsafe_time') ||  apiary.get_config('action_handler_failsafe_time') || 4000;
	}

	var waterfall_functions = _.map(_default_pipes, function (fname) {

		var choice = _choose_method(fname);

		return function (inner_callback) {
			var failsafe_time = _failsafe_time();
			var failsafe = false;

			var sto = setTimeout(function(){
				failsafe = true;
				var message = 'action ' + self.$path +  ' ' + choice.handler_name + '(' + method + ') took longer than ' + failsafe_time;
				self.emit('log', 'error', message);
				inner_callback(new Error(message));
			}, failsafe_time);

			self.emit('log', 'debug', 'started ' + choice.handler_name + ' of ' + self.$path);

			_.bind(choice.handler, self)( context, function (err) {
				if (!failsafe){
					clearTimeout(sto);

					if (err){
						self.emit('log', 'error', 'action error: ', + _.isString(err) ? err : err.message);
						inner_callback(err);
					} else {
						self.emit('log', 'debug', 'completed ' + choice.handler_name + ' of ' + self.$path);
						inner_callback();
					}
				}
			});
		}

	});

	async.waterfall(waterfall_functions, function (err) {
		if (_DEBUG) {
			var args = _.toArray(arguments);
			if (_DEBUG) console.log('%s: FINAL CALLBACK has args %s', context.$req.url, util.inspect(args, false, 0));
		}

		if (err && _.isString(err)) {
			err = new Error(err);
		}
		output_callback(err);
	});
};