var hc = require('hive-component');
var _ = require('underscore');
var _action = require('./_action');
var util = require('util');


module.exports = function(extend, config, cb){
    _.defaults(extend, _action);
    return hc(extend, config, cb);

}