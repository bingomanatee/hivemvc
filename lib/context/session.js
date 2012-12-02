module.exports = {

	$session: function (key, def) {
		if ((this.$req.hasOwnProperty('session')) && (this.$req.session.hasOwnProperty(key))) {
			return this.$req.session[key];
		} else {
			return def;
		}
	},

	$session_set: function (key, value) {
		if (this.$req.hasOwnProperty('session')){
			this.$req.session[key] = value;
		}
	},

	$session_clear: function (key) {
		if (this.$req.hasOwnProperty('session')){
			this.$req.session[key] = null;
		}
	}

}