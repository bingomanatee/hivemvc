var Action = require('./../index').Action;
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var _DEBUG = false;

if (true) tap.test('response', function (t) {

    Action({},{}, function(err, action){

        action.respond({a: 1}, function(err, ctx){
            if (_DEBUG)   console.log('arguments to response:respond: %s', util.inspect(arguments));

            t.equals(ctx.a, 1, 'context passed through');
            t.end();
        });

    })

})

if (true) tap.test('response with output', function (t) {

    Action({
        on_output: function(ctx, cb){
            if (_DEBUG)    console.log('arguments to rwo on_output: %s', util.inspect(arguments));
            ctx.foo = 'bar';
            cb(null, ctx)
        }

    },{}, function(err, action){
	   // console.log('action keys: ', _.keys(action).slice(0, 5));
        action.respond({a: 1, count: 1}, function(err, ctx){
            if (_DEBUG)   console.log('rwo arguments from respond: %s', util.inspect(arguments));
            t.equals(ctx.foo, 'bar' , 'context altered by activity');
            t.end();
        })
    })

})

if (true) tap.test('respond with input and output', function(t){

    Action({
        on_process: function(ctx, cb){
            ctx.foo = 4;
            cb(null, ctx)
        },
        on_output: function(ctx, cb){
            if (_DEBUG) console.log('arguments to _on_process: %s', util.inspect(arguments));
            cb(null, ctx, ctx.foo * 2);
        }
    },{}, function(err, action){
        action.respond({a: 1}, function(err, ctx, output){
            if (_DEBUG) console.log('final output to respond: %s', util.inspect(_.toArray(arguments)));
            t.equals(output, 8 , 'output passes out value based on input');
            t.end();
        })
    })


})

if (false) tap.test('exit out via errors', function(t){

	Action({
		on_input: function(ctx, cb){
			ctx.a = 2;
			cb(new Error('bad code'), ctx);
		},

		on_output: function(ctx, cb){
			ctx.a = 3;
			cb(null, ctx);
		}
	}, {}, function(err, action){
		var ctx = {a: 1};
		action.respond(ctx, function(err, ctx2, output){

			t.equals(err.message, 'bad code', 'error with bad code');
			t.equals(ctx.a, 2); // note - on_output is never reached
			t.end();
		})
	})
})

if (true) tap.test('going postal', function(t){
	Action({
		on_post_process: function(ctx, cb){
			ctx.tags = ['alpha', 'beta', 'gamma'];
			cb(null, ctx);
		}
	}, {}, function(err, action){
		action.respond({method: 'post'}, function(err, ctx2, output){
			t.deepEqual(ctx2.tags, ['alpha', 'beta', 'gamma'], 'got to post process');
			t.end();
		})
	})


})