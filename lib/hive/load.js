var hive_loader = require('hive-loader');

var actions_handler = require('./handlers/actions_handler');

module.exports = function (cb, root) {
	if (!root) {
		root = this.get_config('root');
	}
	console.log(' --------- loading actions from root ' + root);
	return hive_loader.loader(
		{},
		{
			root: root,
			target: this,
			handlers: [ actions_handler({}, {target: this})]
		}
	).load(cb);
}