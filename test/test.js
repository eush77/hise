'use strict';

var hise = require('..');

var tape = require('tape'),
    test = require('tape-drain')(tape),
    glob = require('glob'),
    hyperstream = require('hyperstream'),
    trumpet = require('trumpet'),
    through = require('through2');

var basename = require('path').basename,
    fs = require('fs');


test(function (t) {
  var mainScript = fs.readFileSync(__dirname + '/../lib/script.js', 'utf8');

  glob(__dirname + '/fixtures/*([^.]).html', function (err, files) {
    if (err) throw err;

    t.plan(2 * files.length);

    files.forEach(function (inputPath) {
      if (basename(inputPath).split('.').slice(1) != 'html') {
        throw Error('Invalid test fixture: ' + JSON.stringify(inputPath));
      }

      var outputPath = inputPath.replace(/\.html$/, '.out.html');
      var name = basename(inputPath).split('.', 1)[0];

      var output = fs.createReadStream(inputPath).pipe(hise());

      // Check HTML output.
      t.drain.equal(output.pipe(hyperstream({ script: '' })),
                    fs.createReadStream(outputPath),
                    name);

      // Check <script> contents.
      output.pipe(trumpet()).createReadStream('script')
        .pipe(through(function (chunk, enc, done) {
          if (chunk.toString().indexOf(mainScript) >= 0) {
            t.pass('script found');
          }
          done();
        }));
    });
  });
});


test('opts.ignoreCase', function (t) {
  [{
    stream: hise(),
    needle: '"ignoreCase":false',
    label: 'false (default)'
  }, {
    stream: hise({ ignoreCase: false }),
    needle: '"ignoreCase":false',
    label: 'false'
  }, {
    stream: hise({ ignoreCase: true }),
    needle: '"ignoreCase":true',
    label: 'true'
  }].forEach(function (testCase) {
    t.test('opts.ignoreCase = ' + testCase.label, function (t) {
      t.plan(1);

      testCase.stream.pipe(trumpet()).createReadStream('script')
        .pipe(through(function (chunk, enc, done) {
          if (chunk.toString().indexOf(testCase.needle) >= 0) {
            t.pass();
          }
          done();
        }));

      testCase.stream.end();
    });
  });

  t.end();
});
