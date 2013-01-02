var _ = require('underscore');
var util = require('util');
var path = require('path');
var _DEBUG = false;
var mvc_path = path.resolve(__dirname, './../../../../../../index');
var mvc = require(mvc_path);

module.exports = function (apiary, callback) {
	var _helper = {
		post: true,
		weight: 100,
		respond: function (ctx, output, html, cb) {
			if (output.layout) {
				output.body = html;
				var engine = path.extname(output.layout);

				if (apiary.app.engines[engine]) {
					return apiary.app.engines[engine](output.layout, output, function (layout_err, layout_html) {
						cb(layout_err, ctx, output, layout_html);
					})
				}
			}

			cb(null, ctx, output, html);
		}
	};

	callback(null, _helper);
};
