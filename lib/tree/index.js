var tree_mixin = require('./mixins');
var Component = require('hive-component');
var _ = require('underscore')

module.exports = function(mixins, config, cb){
	_.extend(mixins, tree_mixin);
	return Component(mixins, config, cb);
};