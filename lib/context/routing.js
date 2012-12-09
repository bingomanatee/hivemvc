var _ = require('underscore');

module.exports = {

	$go: function(url){
		this.$res.redirect(url);
	},

	$send: function(status, url){
		if (status && url){
			this.$res.send(status, url);
		} else if (url) {
			this.$res.send(url);
		} else {
			this.$res.send(status);
		}
	},

	$render: function(template, output){
		this.$res.render(template, output);
	},

	$flash: function(type, msg){
		this.$req.flash(type, msg);
	},

	$phase: function(){
		if (this.$phases.length){
			return _.last(this.$phases);
		} else {
			return 'UNKNOWN';
		}
	}

}