

module.exports = {

	on_process: function(ctx, cb){
		ctx.$out.set('bar', [1, 2, 3]);
		cb (null, ctx)
	}

}