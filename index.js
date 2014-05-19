/*!
 * justified <https://github.com/jonschlinkert/justified>
 *
 * Copyright (c) 2014, Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */


var repeat = require('repeat-string');
var randomize = require('randomatic');
var _ = require('lodash');
var utils = require('./lib/utils');


var replaceAt = function(options) {
  options = options || {};

  var pattern = options.pattern;
  var replacement = options.replacement;
  var str = options.str;
  var num = options.num;

  var i = 0;
  return str.replace(pattern, function (match) {
    i++;
    return new RegExp(num).test(i) ? replacement : match;
  });
};

function trueUp(line, longest) {
  var diff = longest - line.length - 1;
  var indices = String(randomize('0', diff)).split('');
  if (indices.length) {
    var re = indices.join('|');
    var opts = {
      pattern: / /g,
      replacement: '  ',
      str: line,
      num: '^' + re + '$'
    };
    line = replaceAt(opts);
  }
  return line;
}

var justified = function(str) {
  var arr = utils.lineArray(str);
  var longest = utils.charsLongest(arr);
  var last = arr.length - 1;
  var stack = [];

  arr.forEach(function(line, i) {
    line = utils.justified(longest, line).replace(/\s+$/, '');
    if(longest > line.length) {
      line = trueUp(line, longest);
    }

    if (i === last) {
      line = line.replace(/\s+/, ' ');
    }
    stack = stack.concat(line);
  });
  return stack.join('\n');
};


justified.parseLines = function(str) {
  var lines = utils.lineArray(str);
  var longest = utils.charsLongest(lines);
  var shortest = utils.charsShortest(lines);

  var info = {
    wrapped: utils.wrap(str),
    lineArray: lines,
    longest: longest,
    shortest: shortest,
    totalLines: utils.totalLines(lines),
    totalWords: utils.totalWords(lines),
    totalSpaces: utils.totalSpaces(lines),
    avgLength: utils.avgLength(lines),
    avgWords: utils.avgWords(lines),
    avgSpaces: utils.avgSpaces(lines),
    lines: []
  };

  lines.map(function(line, i) {
    info.lines.push({
      idx: i,
      justify: utils.justify(info.avgLength, line),
      wordArray: utils.wordArray(line),
      justified: utils.justified(longest, line),
      chars: utils.countChars(line),
      spaces: utils.countSpaces(line),
      words: utils.countWords(line),
      charsDelta: utils.charsDelta(longest, line)
    });
  });
  return info;
};

module.exports = justified;