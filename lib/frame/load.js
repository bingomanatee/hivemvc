var frame_loader = require('./../loaders/frame_loader');
var hives_handler = reqwuire('./../handlers/hive_handler');

module.exports = function (cb, root) {
	if (!root) {
		root = this.get_config('root');
	}
	return frame_loader.loader(
		{},
		{
			root: root,
			target: this,
			handlers: [ hives_handler({}, {target: this})]
		}
	).load(cb);
}