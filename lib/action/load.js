var action_loader = require('./../loaders/action_loader');
var util = require('util');
var Gate = require('gate');
var _ = require('underscore');
var _DEBUG = false;

module.exports = function (cb) {
	var args = _.toArray(arguments);
	if (_DEBUG) console.log('arguments to laod: %s', util.inspect(args));
	var root = this.get_config('root');
	if (!root){
		if (_DEBUG)  console.log('action.load: attempt to laod action with no root');
		// we allow this for unit testing purposes
		return cb();
	}

	if (_DEBUG) console.log('loading action root %s', root);

	var loader = action_loader(
		root,
		this
	);
	loader.core(this.get_config('apiary'));

	var self = this;
	var lto = setTimeout(function(){
		console.log('hanging timeout for ACTION %s', self.get_config('root'));
	}, 2000)
	loader.load(function(){
		clearTimeout(lto);
		cb();
	});
};