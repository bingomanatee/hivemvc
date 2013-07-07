

module.exports = {

	on_process: function(ctx, cb){
		setTimeout(function(){
			cb(new Error('blown up'));
		}, 10000);
	}

};