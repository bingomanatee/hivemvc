var action_mixin = require('./action');
var tree_mixin = require('./../mixins/tree');
var Component = require('./../component');
var _ = require('underscore');
var util = require('util');

module.exports = function(mixins, config, cb){
	_.defaults(mixins, tree_mixin, action_mixin);
	return Component(mixins, config, cb);
}