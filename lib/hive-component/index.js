var _ = require('underscore');
var configuration = require('configuration');
var Hive_Component = require('./lib/Hive_Component');

module.exports = function (extend, config, cb) {
    return new Hive_Component(extend, config, cb)
};

module.exports.Hive_Component = Hive_Component;
