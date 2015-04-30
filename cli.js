#!/usr/bin/env node
'use strict';

var fs = require('fs');


process.stdin.pipe(process.stdout);

process.stdin.on('end', function () {
  process.stdout.write('<script>' +
                       fs.readFileSync(__dirname + '/index.js') +
                       '</script>');
});
