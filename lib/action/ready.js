var Gate = require('gate');
var Model = require('./../model');
var Resource = require('./../resource');
var res_pk = require('./../resource/make_pk');

function _type(names, type) {
	return _.map(names, function (name) {
		return res_pk({name: name, TYPE: type});
	})
}

module.exports = function (ctx, cb) {
	var ready = true;
	var gate = Gate.create();

	if (this.has_config('models')) {
		var models = this.get_config('models');
		if (models && models.length) {
			var model_latch = gate.latch()
			Model.list.has_keys(_type(this.req_models, 'model'), function (err, has) {
				if (!has) {
					ready = false;
				}
				model_latch();
			});
		}
	}

	var resources = [];

	if (ready && this.has_config('resources')) {
		resources = resources.concat(this.get_config('resources'));
	}

	if (ready && this.has_config('req_resources')) {
		var req_resources = this.get_config('req_resources');
		resources = resources.concat(req_resources);
	}

	if (resources.length) {
		var l = gate.latch();
		Resource.list.has_keys(_.map(resources, res_pk), function (err, has) {
			if (!has) {
				ready = false;
			}
			l();
		});
	}

	gate.await(function () {
		cb(null, ready);
	})

};