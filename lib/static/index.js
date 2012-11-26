var hc = require('hive-component');

var _mixins = require('./mixins');



module.exports = function(config, mixins, cb){

	return hc(config, [_mixins, mixins], cb);

};