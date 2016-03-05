#!/usr/bin/env node
'use strict';

var hise = require('./');

var App = require('help-version'),
    minimist = require('minimist');

var fs = require('fs');


var app = App([
  'Usage:  hise [<file>]',
  '',
  'Reads <file> or stdin, writes to stdout.',
  '',
  'Options:',
  '  --ignore-case, -i  Ignore case when performing a match.'
].join('\n'));

var opts = minimist(process.argv.slice(2), {
  boolean: 'ignore-case',
  alias: {
    'ignore-case': 'i'
  },
  unknown: function (arg) {
    if (arg[0] == '-') {
      app.help(1);
    }
  }
});


(function main (opts, argv) {
  if (argv.length > 1) {
    return app.help(1);
  }

  (argv.length == 1 ? fs.createReadStream(argv[0]) : process.stdin)
    .pipe(hise({ ignoreCase: opts['ignore-case'] }))
    .pipe(process.stdout);
}(opts, opts._));
