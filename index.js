'use strict';

var browserify = require('browserify'),
    scriptInjector = require('script-injector'),
    through = require('through2'),
    duplexer = require('duplexer2'),
    encodeEntities = require('html-entities').XmlEntities.encode;


var bundle = function (opts, cb) {
  var init = through();
  browserify(init, { basedir: __dirname })
    .bundle(cb);

  init.end('require("./lib/script")(' + JSON.stringify(opts) + ')');
};


// Transform stream that wraps its input in a <pre> tag.
var HtmlWrapStream = function () {
  var firstChunk = true;
  var wrap = true;

  return through(function (chunk, enc, done) {
    if (firstChunk) {
      firstChunk = false;
      this.push('<pre>');
    }

    if (wrap) {
      chunk = encodeEntities(chunk.toString());
    }

    this.push(chunk);
    done();
  }, function (done) {
    if (!firstChunk) {
      // Disable encoding of the next thing we push.
      wrap = false;

      this.end('</pre>');
    }
    done();
  });
};


module.exports = function (opts) {
  opts = opts || {};
  var input = opts.raw ? HtmlWrapStream() : through();
  var output = through();

  bundle({ ignoreCase: opts.ignoreCase || false }, function (err, buf) {
    if (err) throw err;

    input
      .pipe(scriptInjector(Function(buf.toString())))
      .pipe(output);
  });

  return duplexer(input, output);
};
