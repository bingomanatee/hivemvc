var async = require('async');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;
var _DEBUG2 = false;

function _push_phase(ctx, phase) {
	if (!ctx.$phases) {
		ctx.$phases = [phase];
	} else {
		ctx.$phases.push(phase);
	}
}

function _action_closure(phase, name) {
	return function (ctx) {
		var args = _.toArray(arguments);

		_push_phase(ctx, name);
		phase.apply(this, args);
	}
}

function _pipette(context, cb) {
	if (!context){
		throw new Error('_pipette not passed context');
	}
	if (_DEBUG)  console.log('arguments to STOCK_on_validate: %s', util.inspect(_.toArray(arguments)));
	if (_DEBUG) console.log('_validate keys: ', _.keys(this).slice(0, 5));
	if (_route_method.call(this, context, cb)) return;
	cb(null, context);
}

/**
 * Note - the action _response_chain is called
 * one method after another until the final output is passed
 * out the end of the chain.
 *
 * The provided chain, validate/input/process/output, is a common pattern
 * but any chain you want can be used in its place.
 *
 * note-if you return an error, the pipe waterfall is "shorted".
 *
 * @type {Object}
 */

function _route_method(context, cb) {
	if (!context){
		throw new Error('no context passed to _route_method')
	}
	var phase = _.last(context.$phases);
	var method = context.$req.method.toLowerCase();

	if (!phase) {
		return false;
	}

	if (method) {
		var method_phase_handler = util.format("on_%s_%s", method, phase);
		if (_.isFunction(this[method_phase_handler])) {
			if (_DEBUG) console.log('found method_phase_handler %s', method_phase_handler)
			this[method_phase_handler].call(this, context, cb);
			return true;
		}
	}

	var phase_handler = util.format("on_%s", phase);
	if (_.isFunction(this[phase_handler])) {
		if (_DEBUG) console.log('found phase_handler %s', phase_handler)
		this[phase_handler].call(this, context, cb);
		return true;
	}
	return false;
}

module.exports = function (context, output_callback) {
	if (_DEBUG) console.log('action:respond args: %s', util.inspect(arguments));
	if (_DEBUG2) console.log('action %s responding to url %s', this.get_config('root'), context.$req.url);
	var self = this;
	var pipe = self.pipe ? self.pipe : [
		[_pipette, 'validate'],
		[ _pipette, 'input'],
		[ _pipette, 'process'],
		[_pipette, 'output']
	]

	var respond_wf = _.map(pipe, function (pipe, i) {
		var pipe_def = pipe.slice(0);
		pipe_def[0] = _.bind(pipe_def[0], self);
		var out = _action_closure.apply(self, pipe_def);
		// injecting context
		return i ? out : function (cb) {
			out.call(self, context, cb);
		}
	});

	async.waterfall(respond_wf, output_callback);
};