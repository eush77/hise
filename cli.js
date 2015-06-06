#!/usr/bin/env node
'use strict';

var help = require('help-version')(usage()).help,
    minimist = require('minimist'),
    browserify = require('browserify'),
    stread = require('stread');

var fs = require('fs');


function usage() {
  return [
    'Usage:  hise [<file>]',
    '',
    'Reads <file> or stdin, writes to stdout.',
    '',
    'Options:',
    '  --ignore-case, -i  Ignore case while attempting a match.'
  ].join('\n');
}


var bundle = function (opts, cb) {
  var init = 'require("./")(' + JSON.stringify(opts) + ')';
  browserify(stread(init), { basedir: __dirname })
    .bundle(cb);
};


(function (argv) {
  var opts = minimist(argv, {
    boolean: 'ignore-case',
    alias: {
      'ignore-case': 'i'
    },
    unknown: function (arg) {
      if (arg[0] == '-') {
        help(1);
      }
    }
  });

  if (opts._.length > 1) {
    return help(1);
  }

  var input = (opts._.length == 1)
        ? fs.createReadStream(opts._[0])
        : process.stdin;

  input.pipe(process.stdout);

  input.on('end', function () {
    process.stdout.write('<script>');
    bundle({ ignoreCase: opts['ignore-case'] }, function (err, buf) {
      if (err) throw err;
      process.stdout.write(buf.toString());
      process.stdout.write('</script>');
    });
  });
}(process.argv.slice(2)));
