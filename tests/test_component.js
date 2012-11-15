var action = require('./../index').component;
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');

tap.test('configuration', function (t) {

    var h = hc({}, {a:1, b:2});

    t.equals(h.get_config('a'), 1, 'INJECT: a is 1');

    hc({}, path.resolve(__dirname, '../test_resources/hc/config.json'), function (err, h) {
        if (err) console.log(err);
        t.equals(h.get_config('a'), 2, 'JSON: a is 2')
        t.end();
    });

})

tap.test('init', function (t) {

    hc({}, {a:1, b:2}, function (err, hc) {
        t.equals(hc.get_config('a'), 1, 'init - a is 1');
        hc.init(function () {
                t.equals(hc.get_config('a'), 3, 'wf1 - a is 3`');
                t.equals(hc.get_config('b'), 6, 'wf2 - b is 6')
                t.end();
            },
            [
                function (cb) {
                    this.config().set('a', 3);
                    cb();

                }
                , function (cb) {
                this.config().set('b', this.get_config('a') * 2);
                cb();
            }
            ]

        )
    })
})