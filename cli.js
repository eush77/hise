#!/usr/bin/env node
'use strict';

var help = require('help-version')(usage()).help,
    browserify = require('browserify'),
    stread = require('stread');


function usage() {
  return [
    'Usage:  hise',
    '',
    'Reads stdin, writes to stdout.'
  ];
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
