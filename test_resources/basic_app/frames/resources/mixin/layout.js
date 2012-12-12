var Gate = require('gate');
module.exports = function(callback, mvc){

	var layout_loader = require('layout_loader');

	function load_layouts(frame, cb){
		var ll = layout_loader(frame.get_config('root'));
		ll.load(cb);
	}

	mvc.on('frame', load_layouts);

	mvc.Frame.list.all(function(err, frames){

		var gate = Gate.create();

		_.each(frames, function(frame){
			load_layouts(frame, gate.latch());
		});

		gate.await(callback);

	})

}