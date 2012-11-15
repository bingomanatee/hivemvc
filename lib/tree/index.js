var tree_mixin = require('./../mixins/tree');
var Component = require('./../component/lib/Component');
var _ = require('underscore')

module.exports = function(mixins, config, cb){
	_.extend(mixins, tree_mixin);
	return Component(mixins, config, cb);
}