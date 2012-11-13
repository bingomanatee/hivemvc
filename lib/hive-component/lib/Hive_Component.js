var _ = require('underscore');
var events = require('events');
var util = require('util');
var fs = require('fs');
var path = require('path');

function HiveComponent(extend, config, cb) {
    this.extend(extend);
    this.config(config, cb);
};

util.inherits(HiveComponent, events.EventEmitter);

_.extend(HiveComponent.prototype, {
    extend:function (ob, supplement) {
        if (supplement) {
            _.defaults(this, ob);
        } else {
            _.extend(this, ob);
        }
    },

    init:require('./_init'),

    _init_tasks:[],

    // ****************** CONFIGURE *******************

    config:require('./_config'),

    get_config: function(key){
        return this.config().get(key);
    }

})

module.exports = HiveComponent