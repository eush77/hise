'use strict';

var browserify = require('browserify'),
    scriptInjector = require('script-injector'),
    stread = require('stread'),
    through = require('through2'),
    duplexer = require('duplexer2'),
    encodeEntities = require('html-entities').XmlEntities.encode;


var bundle = function (opts, cb) {
  var init = 'require("./lib/script")(' +
        JSON.stringify(opts) + ')';
  browserify(stread(init), { basedir: __dirname })
    .bundle(cb);
};


// Transform stream that wraps its input in <pre> tags unless it's HTML already.
var HtmlWrapStream = function () {
  var wrapInPre;

  return through(function (chunk, enc, cb) {
    if (wrapInPre == null) {
      chunk = chunk.toString();
      var initialChar = /\S/.exec(chunk);

      if (initialChar == null) {
        // The chunk is all whitespace.
        return cb(null, chunk);
      }

      // Push leading whitespace.
      this.push(chunk.slice(0, initialChar.index));
      chunk = chunk.slice(initialChar.index);

      // Check the first non-whitespace character: if it is "<",
      // treat input as HTML. Otherwise enable wrapping.
      if (initialChar[0] == '<') {
        wrapInPre = false;
      }
      else {
        wrapInPre = true;
        this.push('<pre>');
      }
    }

    if (wrapInPre) {
      chunk = encodeEntities(chunk.toString());
    }

    cb(null, chunk);
  }, function (cb) {
    if (wrapInPre) {
      // Disable encoding of the next thing we push.
      wrapInPre = false;

      this.end('</pre>');
    }
    cb();
  });
};


module.exports = function (opts) {
  var input = HtmlWrapStream();
  var output = through();

  opts = opts || {};

  bundle({ ignoreCase: opts.ignoreCase || false }, function (err, buf) {
    if (err) throw err;

    input
      .pipe(scriptInjector(Function(buf.toString())))
      .pipe(output);
  });

  return duplexer(input, output);
};
