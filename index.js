'use strict';

var expandSelection = require('expand-selection');


module.exports = function (opts) {
  document.addEventListener('mouseup', function () {
    expandSelection(opts);
  });
};
