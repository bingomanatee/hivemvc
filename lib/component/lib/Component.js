var _ = require('underscore');
var events = require('events');
var util = require('util');
var fs = require('fs');
var path = require('path');

var _id = 0;
function Component(extend, config, cb) {
    this.extend(extend);
    this.component_id = ++_id;
    this.config(config, cb);
};

util.inherits(Component, events.EventEmitter);

_.extend(Component.prototype, {
    extend:function (ob, supplement) {
        if (supplement) {
            _.defaults(this, ob);
        } else {
            _.extend(this, ob);
        }
    },

    init:require('./_init'),

    TYPE: 'HIVE_COMPONENT',

    _init_tasks:[],

    // ****************** CONFIGURE *******************

    config:require('./_config'),

    get_config: function(key){
        return this.config().get(key);
    }

})

module.exports = Component