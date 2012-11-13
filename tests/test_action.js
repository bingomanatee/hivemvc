var action = require('hive-mvc').action;
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var _DEBUG = false;

tap.test('response', function (t) {

    action({},{}, function(err, action){

        action.respond({a: 1}, function(err, ctx){
            if (_DEBUG)   console.log('arguments to response:respond: %s', util.inspect(arguments));

            t.equals(ctx.a, 1, 'context passed through');
            t.end();
        });

    })

})

if (true) tap.test('response with output', function (t) {

    action({
        on_output: function(ctx, cb){
            if (_DEBUG)    console.log('arguments to rwo on_output: %s', util.inspect(arguments));
            ctx.foo = 'bar';
            cb(null, ctx)
        }

    },{}, function(err, action){
        action.respond({a: 1, count: 1}, function(err, ctx){
            if (_DEBUG)   console.log('rwo arguments from respond: %s', util.inspect(arguments));
            t.equals(ctx.foo, 'bar' , 'context altered by activity');
            t.end();
        })
    })

})

if (false) tap.test('respond with input and output', function(t){

    action({
        _on_process: function(ctx, args, cb){    console.log('arguments to _on_process: %s', util.inspect(arguments));
            cb(args[0].foo * 2);
        }
    },{}, function(err, action){
        action.respond({a: 1}, function(ctx, output){
            t.equals(output[0], 8 , 'output passes out value based on input');
            t.end();
        }, {foo: 4})
    })


})