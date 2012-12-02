var hive_loader = require('./../loaders/hive_loader');
// note - there is a module named 'hive-loader' which is the loading base class, namespaced to hive.
// this hive-loader is an instance of that loader, for loading hives.

module.exports = function (cb, root) {
	if (root) {
		this.set_config('root', root);
	} else {
		root = this.get_config('root');
	}
	 hive_loader(null, root, this).load(cb);
}