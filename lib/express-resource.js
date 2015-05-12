'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
/* -*- mode: javascript -*- */

var _Left$Right = require('fantasy-eithers');

var _Some$None = require('fantasy-options');

var isPromise = function isPromise(v) {
  return v !== null && typeof v === 'object' && typeof v.then === 'function';
};

exports['default'] = function (cb) {
  return function (req, res) {
    var handler = (function (_handler) {
      function handler(_x) {
        return _handler.apply(this, arguments);
      }

      handler.toString = function () {
        return _handler.toString();
      };

      return handler;
    })(function (data) {
      if (isPromise(data)) {
        // If the data is a promise, then bind the handler
        data.then(handler)['catch'](function (err) {
          res.status(500);
          res.end();
        });
      } else if (data == _Some$None.None) {
        // If the data is None, respond with a 404 Not Found
        res.status(404).end();
      } else if (data instanceof _Some$None.Some) {
        // If the data is a Some value, unwrap the contained data
        handler(data.x);
      } else if (data instanceof _Left$Right.Left) {
        // If the data is a Left value, treat that as a 404 and pass on
        // the contained value for rendering
        res.status(400);
        handler(data.l);
      } else if (data instanceof _Left$Right.Right) {
        // If the data is a Right value, just unwrap the contained data
        return handler(data.r);
      } else {
        // Finally, serialized the data as JSON
        res.json(data);
      }
    });
    handler(cb(req, res));
  };
};

module.exports = exports['default'];
