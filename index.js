'use strict';

var browserify = require('browserify'),
    stread = require('stread'),
    through = require('through2'),
    duplexer = require('duplexer2');


var bundle = function (opts, cb) {
  var init = 'require("./lib/script")(' +
        JSON.stringify(opts) + ')';
  browserify(stread(init), { basedir: __dirname })
    .bundle(cb);
};


module.exports = function (opts) {
  var input = through();
  var output = through();

  // TODO: This is broken in the sense that it doesn't work for HTML anymore.
  // What a shame.
  output.write('<pre>');

  input.pipe(output, { end: false });

  input.on('end', function () {
    output.write('</pre><script>');
    bundle({ ignoreCase: opts['ignore-case'] }, function (err, buf) {
      if (err) throw err;
      output.write(buf.toString());
      output.end('</script>');
    });
  });

  return duplexer(input, output);
};
