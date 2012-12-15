var Component = require('hive-component');
var _ = require('underscore');
var _ssr_registry = require('ssr_registry');
var _atomize = require('ssr_atomize');

function _queue_files(queue_cb) {
	if (!this.queue) {
		this.queue = [];
	}

	var mp = path.resolve(__dirname, '../../../../../index');
	var mvc = require(mp);

	mvc.Model.list.get('$ss_require', function (err, ssr) {
		ssr.all(function (err, ssr_req) {
			var registry = _ssr_registry(ssr, ssr_req);

			var _atom_reqs = _atomize(registry);
			_atom_reqs.push(queue_cb);
		});

	});
}

var _mixins = {
	init_tasks: [
		_queue_files
	]
};

module.exports = function (cb, files) {
	if (!files) {
		files = [];
	}

	var mp = path.resolve(__dirname, '../../../../../index');
	var mvc = require(mp);

	mvc.Model.list.get('$ss_require', function (err, ssr) {
		Component(_mixins, {files: files, ssr: ssr.all().records()}).init(cb);
	});
};