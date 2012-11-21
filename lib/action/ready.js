var Gate = require('gate');
var Model = require('./../model');
var Resource = require('./../resource');

module.exports = function(cb){
	var ready = true;
	var gate = Gate.create();

	if (this.req_models.length){
		var model_latch = gate.latch()
		 Model.list.has_keys(this.req_models, function(err, has){
			 if (!has){
				 ready = false;
			 }
			 model_latch();
		 });
	}

	if (this.req_resources.length){
		var res_latch = gate.latch();
		Resource.list.has_keys(this.req_resources, function(err, has){
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