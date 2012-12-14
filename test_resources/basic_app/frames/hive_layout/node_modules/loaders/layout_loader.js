var hive_loader = require('hive-loader');
var layout_file_handler = require('handlers/layout_file_handler');
var layout_config_handler = require('handlers/layout_config_handler');

module.exports = function(layout){
	return hive_loader.loader({}, {
		handlers: [layout_file_handler(), layout_config_handler()],
		root: layout.get_config('root'),
		target: layout
	})
};