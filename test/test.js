'use strict';

var hise = require('..');

var tape = require('tape'),
    test = require('tape-drain')(tape),
    hyperstream = require('hyperstream'),
    trumpet = require('trumpet'),
    through = require('through2');

var path = require('path'),
    fs = require('fs');


// Read test fixture.
var read = function (filePath) {
  return fs.createReadStream(path.join(__dirname, 'fixtures', filePath));
};

// Used to roughly check <script> contents.
var mainScript = fs.readFileSync(__dirname + '/../lib/script.js', 'utf8');

var checkOutput = function (output, expected) {
  return function (t) {
    t.plan(2);

    // Check HTML output.
    t.drain.equal(output.pipe(hyperstream({ script: '' })), expected,
                  'HTML checked');

    // Check <script> contents.
    output.pipe(trumpet()).createReadStream('script')
      .pipe(through(function (chunk, enc, done) {
        if (chunk.toString().indexOf(mainScript) >= 0) {
          t.pass('script found');
        }
        done();
      }));
  };
};


test('HTML input', function (t) {
  t.test('full HTML markup',
         checkOutput(read('html.html').pipe(hise()),
                     read('html.out.html')));
  t.test('partial HTML markup',
         checkOutput(read('htmlish.html').pipe(hise()),
                     read('htmlish.out.html')));
  t.end();
});


test('raw input',
     checkOutput(read('raw.html').pipe(hise({ raw: true })),
                 read('raw.out.html')));


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
