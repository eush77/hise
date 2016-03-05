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


module.exports = function (opts) {
  var input = through();
  var output = through();

  opts = opts || {};

  bundle({ ignoreCase: opts['ignore-case'] }, function (err, buf) {
    if (err) throw err;

    input
      .pipe(scriptInjector(buf.toString()))
      .pipe(output);
  });

  return duplexer(input, output);

  // TODO: This is broken in the sense that it doesn't work for HTML anymore.
  // What a shame.
  output.write('<pre>');

  input
    .pipe(through(function (chunk, enc, done) {
      this.push(encodeEntities(chunk.toString()));
      done();
    }))
    .pipe(output, { end: false });

  input.on('end', function () {
    output.write('</pre><script>');
  });

  return duplexer(input, output);
};
