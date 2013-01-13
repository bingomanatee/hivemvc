module.exports = {

	on_process: function (context, cb) {
		context.$out.setAll({action: 'foo', response: 2});
		cb();
	}

}