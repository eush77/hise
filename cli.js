#!/usr/bin/env node
'use strict';

var browserify = require('browserify'),
    stread = require('stread');


if (process.argv.slice(2) == '--help') {
  console.log(['Usage:  hise',
               '',
               'Reads stdin, writes to stdout.'].join('\n'));
  process.exit();
}


var bundle = function (cb) {
  browserify(stread('require("./")'), { basedir: __dirname })
    .bundle(cb);
};


process.stdin.pipe(process.stdout);

process.stdin.on('end', function () {
  process.stdout.write('<script>');
  bundle(function (err, buf) {
    if (err) throw err;
    process.stdout.write(buf.toString());
    process.stdout.write('</script>');
  });
});
