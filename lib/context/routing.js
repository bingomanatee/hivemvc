var _ = require('underscore');
var path = require('path');

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
		var self = this;
		this.$res.render(template, output, function(err, html){
			if (output.layout){
				output.body = html;
				var mvc = require('./../../index');
				var ext = path.extname(output.layout);
				var engine =  ext;

				if (mvc.app.engines[engine]){
					mvc.app.engines[engine](output.layout, output, function(err, html){
						self.$res.send(html);
					})
				} else {
					self.$res.send(html);
				}
			} else {
				self.$res.send(html);
			}
		});
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