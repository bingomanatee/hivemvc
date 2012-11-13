var async = require('async');
var _ = require('underscore');
var util = require('util');
var _DEBUG = false;

function _trace(ctx, method){
    if (!ctx.trace){
        ctx.trace = [method];
    } else {
        ctx.trace.push(method);
    }
}
/**
 * Note - the action _response_chain is called
 * one method after another until the final output is passed
 * out the end of the chain.
 *
 * The provided chain, input/process/output, is a common pattern
 * but any chain you want can be used in its place.
 *
 * @type {Object}
 */

module.exports = {

    respond:       function (context, output_callback) {
        if (_DEBUG) console.log('action:respond args: %s', util.inspect(arguments));
        var self = this;
        var respond_wf = _.map(
            [
                [this.on_validate, 'validate'],
               [ this.on_input, 'input'],
               [ this.on_process, 'process'],
                [this.on_output, 'output']
            ]

            , function (d, i) {
                var out = function(ctx, cb){
                    _trace(ctx, d[1]);
                    _.bind(d[0], self)(ctx, cb);
                }
                // injecting context
                if (i){
                    return out;
                } else {
                    return function(cb){
                        out(context, cb);
                    }
                }
            });

        async.waterfall(respond_wf, output_callback);
    }, on_validate:function (context, cb) {
        if (_DEBUG)  console.log('arguments to STOCK_on_validate: %s', util.inspect(arguments));
        cb(null, context);
    }, on_input:   function (context, cb) {
        if (_DEBUG)  console.log('arguments to  STOCK_on_input: %s', util.inspect(arguments));

        cb(null, context);
    }, on_process: function (context, cb) {
        if (_DEBUG) console.log('arguments to  STOCK_on_process: %s', util.inspect(arguments));

        cb(null, context);
    }, on_output:  function (context, cb) {
        if (_DEBUG)   console.log('arguments to  STOCK_on_output: %s', util.inspect(arguments));

        cb(null, context);
    }
}


