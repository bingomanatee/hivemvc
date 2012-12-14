var hive_loader = require('hive-loader');
var Layout = require('layout');
var _DEBUG = false;

var _mixins = {
	name:    'layout_file_handler',
	respond: function (params) {
		if (_DEBUG) console.log('setting template %s', params.file_path)
		this.set_config('template', params.file_path);
	}
};

module.exports = function(){
	return hive_loader.handler(_mixins, {dir: false, name_filter: /(.*)view\.(html|jade|ejs)$/i});
}