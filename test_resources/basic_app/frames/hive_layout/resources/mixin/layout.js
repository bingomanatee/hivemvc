var Gate = require('gate');
var _ = require('underscore')
var _DEBUG = false;
var util = require('util');
var path = require('path');

module.exports = function (cb) {
	cb(null, {
		respond: function (callback) {
			var mp = path.resolve(__dirname, '../../../../../../index');
			var mvc = require(mp);
			var layouts_dir_loader = require('loaders/layouts_dir_loader');

			function load_layouts(frame, cb) {
				if (_DEBUG) {
					console.log('scanning frame for layouts folder: %s', frame.get_config('root'));
				}
				var ll = layouts_dir_loader(frame.get_config('root'));
				ll.load(cb ? cb : _.identity);
			}

			mvc.on('frame', load_layouts);
			var gate = Gate.create();

			mvc.Frame.list.all(function (err, frames) {

				_.each(frames, function (frame) {
					load_layouts(frame, gate.latch());
				});

				gate.await(callback);

			})
		}
	})
};