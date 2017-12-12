/*!
 * connect-timeout
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

/**
 * Module dependencies.模块依赖
 * @private
 */

/**
 *http-errors 创建http错误
 *ms 时间格式转换为毫秒
 *on-finished HTTP请求关闭，完成错误时执行回调
 *on-headers 响应即将写入标头时执行监听器
 */

var createError = require('http-errors');
var ms = require('ms');
var onFinished = require('on-finished');
var onHeaders = require('on-headers');
var http=require('http');

/**
 *timeout函数暴露
 * @public
 */

module.exports = timeout;

/**
 * Create a new timeout middleware.创建一个timeout中间件
 *
 * @param {number|string} [time=5000] The timeout as a number of milliseconds or a string for `ms`
 * @param {object} [options] Additional options for middleware
 * @param {boolean} [options.respond=true] Automatically emit error when timeout reached
 * @return {function} middleware
 * @public
 *
 *创建timeout函数，参数为时间和选项，该函数会返回毫秒为单位的超时中间件。
 */

function timeout (time, options) {

// 定义一个变量opts，默认为一个空对象。
  var opts = options || {};

// 定义一个变量delay,看传入的time参数是否为字符串类型，如果是，用ms转换为毫秒;如果不是转换为数值类型，默认为5000
  var delay = typeof time === 'string' ? ms(time) : Number(time || 5000);

// 定义一个变量respond，当超时时自动发出错误
  var respond = opts.respond === undefined || opts.respond === true;

// 返回一个超时中间件，是一个函数
  return function (req, res, next) {
    
    // 设置一个延时，延时时间为delay，delay时间后，执行函数。
    var id = setTimeout(function () {

      //请求超时
      req.timedout = true;

      //
      req.emit('timeout', delay);
    }, delay);

    // 如果超时
    if (respond) {
      // 执行onTimeout函数
      req.on('timeout', onTimeout(delay, next));
    }
    
    // 清除请求的超时时间，超时被完全清除，将来不会触发此请求。
    req.clearTimeout = function () {
      clearTimeout(id);
    };
    
    // 请求不超时
    req.timedout = false;
    
    //响应结束时，清除请求的超时时间
    onFinished(res, function () {
      clearTimeout(id);
    });

    // 响应即将写入标头时，触发监听器，清除请求的超时时间。
    onHeaders(res, function () {
      clearTimeout(id);
    });
   
    //自定义响应行为
    next();
  };
}

/**
 * Create timeout listener function.
 *
 * @param {number} delay
 * @param {function} cb
 * @private
 */

// 如果超时，返回该函数，
function onTimeout (delay, cb) {
  return function () {

    // 自定义响应行为
    // 创建错误
    // 状态码：503--暂停服务
    // 状态信息：‘响应错误’
    // 附加到对象的自定义属性，{}
    cb(createError(503, 'Response timeout', {
      code: 'ETIMEDOUT',
      timeout: delay
    }));
  };
}


