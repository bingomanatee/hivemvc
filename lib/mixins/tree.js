var _ = require('underscore');

/**
 * Note - this subcomponent is designed around a fairly stable model
 * - children being added, and not removed; p\
 * - once a parent is set it is not changed. (no "Unparent" method).
 *
 * @type {Object}
 */

function _by_name(child) {
	return child.name;
}

var _type_index = {};

function _get_index(query, index) {
	if (query) {
		return _.filter(index, function (child) {
			if (query.type && (child.TYPE != query.type)) {
				return false;
			}
			if (query.name && child.name != query.name) {
				return false;
			}
			return true;
		})
	} else {
		return _.sortBy(_.flatten(_.values(index)), _by_name);
	}
}

module.exports = {

	adopt: function (resource) {
		if (_.isArray(resource)) {
			var self = this;
			_.each(resource, function (child) {
				self.adopt(child);
			});
			return;
		} else if (_.isFunction(resource.parent)) {
			resource.parent(this);
		}
		this._children.push(resource);
		if (resource.TYPE) {
			this._child_type_index[resource.TYPE] = resource;
			_type_index[resource.TYPE] = resource;
		}
	},

	_parent: null,

	parent: function (parent) {
		if (parent) this._parent = parent;
		return this._parent;
	},

	_children:         [],
	_child_type_index: {},

	children: function(query){
		return _get_index(query, this._child_type_index)
	},

	resources: function(query){
		return _get_index(query, _type_index);
	}


}