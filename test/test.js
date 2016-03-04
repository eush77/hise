'use strict';

var hise = require('..');

var tape = require('tape'),
    test = require('tape-drain')(tape),
    glob = require('glob'),
    hyperstream = require('hyperstream');

var basename = require('path').basename,
    fs = require('fs');


test(function (t) {
  glob(__dirname + '/fixtures/*([^.]).html', function (err, files) {
    if (err) throw err;

    t.plan(files.length);

    files.forEach(function (inputPath) {
      if (basename(inputPath).split('.').slice(1) != 'html') {
        throw Error('Invalid test fixture: ' + JSON.stringify(inputPath));
      }

      var outputPath = inputPath.replace(/\.html$/, '.out.html');
      var name = basename(inputPath).split('.', 1)[0];

      var output = fs.createReadStream(inputPath)
            .pipe(hise())
            .pipe(hyperstream({
              'script': ''
            }));

      t.drain.equal(output, fs.readFileSync(outputPath, 'utf8').trim(), name);
    });
  });
});
