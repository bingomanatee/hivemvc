var Action = require('./../index').Action;
var tap = require('tap');
var path = require('path');
var util = require('util');
var _ = require('underscore');
var _DEBUG = false;

if (true) tap.test('going postal', function(t){
	Action({
		on_post_process: function(ctx, cb){
			ctx.tags = ['alpha', 'beta', 'gamma'];
			cb(null, ctx);
		}
	}, {}, function(err, action){
		action.respond({'$req': {method: 'post'}}, function(err, ctx2, output){
			t.deepEqual(ctx2.tags, ['alpha', 'beta', 'gamma'], 'got to post process');
			t.end();
		})
	})
})
