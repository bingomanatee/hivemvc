var Gate = require('gate');
var Resource = require('./../resource');
var res_pk = require('./../resource/make_pk');

function _type(names, type) {
	return _.map(names, function (name) {
		return res_pk({name: name, TYPE: type});
	})
}

module.exports = function (ctx, cb) {
	var ready = true;
	var apiary = this.get_config('apiary');

	if (this.has_config('models')) {
		var models = this.get_config('models');
		if (models && models.length) {
			ready = _.reduce(models, function(ready, model){
				return ready && apiary.has_model(model);
			})
		}
	}

	if (ready){
		var resources = [];

		if (ready && this.has_config('resources')) {
			resources = resources.concat(this.get_config('resources'));
		}

		if (ready && this.has_config('req_resources')) {
			var req_resources = this.get_config('req_resources');
			resources = resources.concat(req_resources);
		}

		if (resources && resources.length) {
			ready = Resource.list.has_keys(_.map(resources, res_pk));
		}
	}

	if (cb){
		cb(null, ready);
	}
	return ready;

};