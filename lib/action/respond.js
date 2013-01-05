var async = require('async');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

var _default_pipes = ['validate', 'input', 'process', 'output'];

module.exports = function (context, output_callback) {

	var method = context.$req.method.toLowerCase();
	var self = this;
	if (_DEBUG) console.log('responding with action %s keys %s', this.get_config('root'), util.inspect(_.keys(this)));

	var respond_wf = _.map(_default_pipes, function (fname) {
		var method_name = util.format('on_%s_%s', method, fname);
		var f = function (ctx, cb) {
			cb();
		};

		if (self[method_name]) {
			f = self[method_name];
		} else {
			method_name = util.format('on_%s', fname);
			if (self[method_name]) {
				f = self[method_name];
			}
		}

		f = _.bind(f, self);

		return function (cb) {
			var args = _.toArray(arguments);
			if (_DEBUG) console.log('%s: waterfall calling %s with args %s', context.$req.url, method_name, util.inspect(args, false, 0));
			f(context, function (err) {
				var args = _.toArray(arguments);
				if (_DEBUG) console.log('%s: waterfall CALLBACK %s has args %s', context.$req.url, method_name, util.inspect(args, false, 0));

				if (_DEBUG) console.log('%s %s returning %s', context.$req.url, method_name, err);
				cb(err);
			});
		}

	});

	async.waterfall(respond_wf, function (err) {
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