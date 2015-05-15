#!/usr/bin/env node
'use strict';

var fs = require('fs');


if (process.argv.slice(2) == '--help') {
  console.log('Usage:  wordhi <HTML');
  process.exit();
}


process.stdin.pipe(process.stdout);

process.stdin.on('end', function () {
  process.stdout.write('<script>' +
                       fs.readFileSync(__dirname + '/index.js') +
                       '</script>');
});
