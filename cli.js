#!/usr/bin/env node
'use strict';

var help = require('help-version')(usage()).help,
    browserify = require('browserify'),
    stread = require('stread');

var fs = require('fs');


function usage() {
  return [
    'Usage:  hise [<file>]',
    '',
    'Reads <file> or stdin, writes to stdout.'
  ].join('\n');
}


var bundle = function (cb) {
  browserify(stread('require("./")'), { basedir: __dirname })
    .bundle(cb);
};


(function (argv) {
  if (argv.length > 1) {
    return help(1);
  }

  var input = (argv.length == 1)
        ? fs.createReadStream(argv[0])
        : process.stdin;

  input.pipe(process.stdout);

  input.on('end', function () {
    process.stdout.write('<script>');
    bundle(function (err, buf) {
      if (err) throw err;
      process.stdout.write(buf.toString());
      process.stdout.write('</script>');
    });
  });
}(process.argv.slice(2)));
