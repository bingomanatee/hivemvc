var hive_loader = require('./../loaders/hive_loader');
// note - there is a module named 'hive-loader' which is the loading base class, namespaced to hive.
// this hive-loader is an instance of that loader, for loading hives.

module.exports = function (cb) {
	var root = this.get_config('root');
	var loader = hive_loader(root, this);
	var self = this;
	var tto = setTimeout(function(){
		console.log('*********hanging hive %s', root);
	}, 2000);
	loader.load(function(){
		clearTimeout(tto);
		cb();
	});
};