'use strict';

var rangeLookup = require('range-lookup');


module.exports = function () {
  document.addEventListener('mouseup', function () {
    var selection = window.getSelection();
    if (selection.isCollapsed || selection.rangeCount != 1) {
      return;
    }
    var query = selection.toString();
    rangeLookup(selection.toString())
      .forEach(selection.addRange.bind(selection));
  });
};
