var hc = require('hive-component');
var _mixins = require('./mixins');
var list = require('./list');

module.exports = function (mixins, config, cb) {

	return hc([mixins, _mixins], [
		{
			init_tasks: [
				function (cb) {
					list.put(this, cb);
				}
			]
		},
		config,
		{weight: 0}
	], cb)

};

module.exports.list = list;