var _ = require('underscore');
var events = require('events');
var util = require('util');
var Configuration = require('configuration');
var fs = require('fs');
var path = require('path');

function _init_config(config_obj, self) {
    self._config = new Configuration(config_obj);
}

module.exports = function (config, cb) {
    if (config) {
        var self = this;
        if (_.isString(config)) {
            if (!_.isFunction(cb)) {
                throw new Error('attempt to load a config file with ' + config + ' without callback');
            }
            // load a JSON file by path
            fs.exists(config, function (config_exists) {
                if (config_exists) {
                    fs.readFile(config, 'utf8', function (err, config_data) {
                        try {
                            var config_obj = JSON.parse(config_data);
                        } catch (e) {
                            if (cb) {
                                return cb(e);
                            } else {
                                throw e;
                            }
                        }
                        self.config(config_obj, cb);
                    });
                } else if (cb) {
                    cb(new Error('cannot read ' + config));
                } else {
                    throw new Error('cannot read ' + config);
                }
            })
            return;
        } else if (_.isObject(config)) {
            if (this._config) {
                _.each(config, function (value, key) {
                    this._config.set(key, value);
                })
            } else {
                _init_config(config, this);
            }
        } else if (_.isArray(config)) {
            if (!this._config) {
                _init_config({} , this);
            }
            config.forEach(function (def) {
                self.config().set(def.key, def.value);
                //@TODO: allow for accumulation
            })
        }
    } else {
        if (!this._config) {
            _init_config({}, this);
        }
    }
    if (cb) {
        cb(null, this);
    } else {
        return this._config;
    }
};