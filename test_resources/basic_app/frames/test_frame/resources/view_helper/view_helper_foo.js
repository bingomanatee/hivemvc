

module.exports = function(cb){

	cb(null, {name: 'foo', respond: function(ctx, output, cb){
		cb(null, ctx, output);
	}})

}