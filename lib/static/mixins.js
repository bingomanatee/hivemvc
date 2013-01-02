var util = require('util');
var _DEBUG = false;

module.exports = function (apiary) {


	return {

		/**
		 *
		 * @param path - a full disk path
		 * @param alias - the uri prefix to all files therein
		 *
		 */
		map: function (path, alias) {
			var prefixes = apiary.model('$static_prefixes');
			if (_DEBUG) console.log('mapping %s to %s', path, alias);

			prefixes.put({prefix: path, alias: alias});
		}
	}

};