var _ = require('underscore');
var Tree = require('./../tree');
/**
 * Resources, unlike tree children, are stored in a global registry, by type.
 *
 * @type {Object}
 */

var registry = Tree();

module.exports = {

	add: function (resource) {
		if (_.isFunction(resource.parent)) {
			resource.parent(this);
		}
		this._children.push(resource);
	},

	_parent: null,

	parent: function (parent) {
		if (parent) this._parent = parent;
		return this._parent;
	},

	_children:               [],
	_children_index_by_type: {},

	children: function (type, name) {
		if (type || name) {
			return _.filter(this._children, function (child) {
				if (type && (child.TYPE != type)) {
					return false;
				}
				if (name && child.name != name) {
					return false;
				}
				return true;
			})
		} else {
			return this._children.slice(0);
		}
	}


}