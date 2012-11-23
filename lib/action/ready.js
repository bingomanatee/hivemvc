var Gate = require('gate');
var Model = require('./../model');
var Resource = require('./../resource');
var res_pk = require('./../resource/make_pk');

function _type(names, type){
	return _.map(names, function(name){
		return res_pk({name: name, TYPE: type});
	})
}

module.exports = function(ctx, cb){
	var ready = true;
	var gate = Gate.create();

	var models = this.get_config('models');
	if (models && models.length){
		var model_latch = gate.latch()
		 Model.list.has_keys(_type(this.req_models,'model'), function(err, has){
			 if (!has){
				 ready = false;
			 }
			 model_latch();
		 });
	}

	var resources = this.get_config('resources');
	if (resources && resources.length){
		var res_latch = gate.latch();
		Resource.list.has_keys(_.map(this.req_resources, res_pk), function(err, has){
			if (!has){
				ready = false;
				res_latch();
			}
		});
	}

	if (this.req_resources.length){
		var res_latch = gate.latch();
		Resource.list.has_keys(_.map(this.req_resources, res_pk), function(err, has){
			if (!has){
				ready = false;
				res_latch();
			}
		});
	}

	gate.await(function(){
		cb(err, ready);
	})
};