var _ = require('underscore');
var hive_config = require('hive-configuration');
var mixins = require('./mixins');

module.exports = function (apiary, callback) {

	function Context(req, res, action) {
		this.$apiary = apiary;
		this.TYPE = 'context';
		this.$req = req;
		this.$res = res;
		this.$phases = [];
		this.$out = new hive_config(); // note that out is a convenience collection
		// - you still have to return the value of out manually through on_output.
		this.$action = action;

		if (this.$action.template) {
			this.$template = this.$action.template;
		}
		this.$parse_body();
	}

	_.extend(Context.prototype, mixins);

	apiary.Context = function (req, res, action) {
		return new Context(req, res, action);
	};

	callback();

};