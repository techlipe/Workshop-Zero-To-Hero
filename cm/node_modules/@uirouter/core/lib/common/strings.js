"use strict";
/**
 * Functions that manipulate strings
 *
 * Although these functions are exported, they are subject to change without notice.
 *
 * @module common_strings
 */ /** */
Object.defineProperty(exports, "__esModule", { value: true });
var predicates_1 = require("./predicates");
var rejectFactory_1 = require("../transition/rejectFactory");
var common_1 = require("./common");
var hof_1 = require("./hof");
var transition_1 = require("../transition/transition");
var resolvable_1 = require("../resolve/resolvable");
/**
 * Returns a string shortened to a maximum length
 *
 * If the string is already less than the `max` length, return the string.
 * Else return the string, shortened to `max - 3` and append three dots ("...").
 *
 * @param max the maximum length of the string to return
 * @param str the input string
 */
function maxLength(max, str) {
    if (str.length <= max)
        return str;
    return str.substr(0, max - 3) + '...';
}
exports.maxLength = maxLength;
/**
 * Returns a string, with spaces added to the end, up to a desired str length
 *
 * If the string is already longer than the desired length, return the string.
 * Else returns the string, with extra spaces on the end, such that it reaches `length` characters.
 *
 * @param length the desired length of the string to return
 * @param str the input string
 */
function padString(length, str) {
    while (str.length < length)
        str += ' ';
    return str;
}
exports.padString = padString;
function kebobString(camelCase) {
    return camelCase
        .replace(/^([A-Z])/, function ($1) { return $1.toLowerCase(); }) // replace first char
        .replace(/([A-Z])/g, function ($1) { return '-' + $1.toLowerCase(); }); // replace rest
}
exports.kebobString = kebobString;
function _toJson(obj) {
    return JSON.stringify(obj);
}
function _fromJson(json) {
    return predicates_1.isString(json) ? JSON.parse(json) : json;
}
function promiseToString(p) {
    return "Promise(" + JSON.stringify(p) + ")";
}
function functionToString(fn) {
    var fnStr = fnToString(fn);
    var namedFunctionMatch = fnStr.match(/^(function [^ ]+\([^)]*\))/);
    var toStr = namedFunctionMatch ? namedFunctionMatch[1] : fnStr;
    var fnName = fn['name'] || '';
    if (fnName && toStr.match(/function \(/)) {
        return 'function ' + fnName + toStr.substr(9);
    }
    return toStr;
}
exports.functionToString = functionToString;
function fnToString(fn) {
    var _fn = predicates_1.isArray(fn) ? fn.slice(-1)[0] : fn;
    return (_fn && _fn.toString()) || 'undefined';
}
exports.fnToString = fnToString;
var stringifyPatternFn = null;
var stringifyPattern = function (value) {
    var isRejection = rejectFactory_1.Rejection.isRejectionPromise;
    stringifyPatternFn =
        stringifyPatternFn ||
            hof_1.pattern([
                [hof_1.not(predicates_1.isDefined), hof_1.val('undefined')],
                [predicates_1.isNull, hof_1.val('null')],
                [predicates_1.isPromise, hof_1.val('[Promise]')],
                [isRejection, function (x) { return x._transitionRejection.toString(); }],
                [hof_1.is(rejectFactory_1.Rejection), hof_1.invoke('toString')],
                [hof_1.is(transition_1.Transition), hof_1.invoke('toString')],
                [hof_1.is(resolvable_1.Resolvable), hof_1.invoke('toString')],
                [predicates_1.isInjectable, functionToString],
                [hof_1.val(true), common_1.identity],
            ]);
    return stringifyPatternFn(value);
};
function stringify(o) {
    var seen = [];
    function format(value) {
        if (predicates_1.isObject(value)) {
            if (seen.indexOf(value) !== -1)
                return '[circular ref]';
            seen.push(value);
        }
        return stringifyPattern(value);
    }
    return JSON.stringify(o, function (key, value) { return format(value); }).replace(/\\"/g, '"');
}
exports.stringify = stringify;
/** Returns a function that splits a string on a character or substring */
exports.beforeAfterSubstr = function (char) { return function (str) {
    if (!str)
        return ['', ''];
    var idx = str.indexOf(char);
    if (idx === -1)
        return [str, ''];
    return [str.substr(0, idx), str.substr(idx + 1)];
}; };
exports.hostRegex = new RegExp('^(?:[a-z]+:)?//[^/]+/');
exports.stripLastPathElement = function (str) { return str.replace(/\/[^/]*$/, ''); };
exports.splitHash = exports.beforeAfterSubstr('#');
exports.splitQuery = exports.beforeAfterSubstr('?');
exports.splitEqual = exports.beforeAfterSubstr('=');
exports.trimHashVal = function (str) { return (str ? str.replace(/^#/, '') : ''); };
/**
 * Splits on a delimiter, but returns the delimiters in the array
 *
 * #### Example:
 * ```js
 * var splitOnSlashes = splitOnDelim('/');
 * splitOnSlashes("/foo"); // ["/", "foo"]
 * splitOnSlashes("/foo/"); // ["/", "foo", "/"]
 * ```
 */
function splitOnDelim(delim) {
    var re = new RegExp('(' + delim + ')', 'g');
    return function (str) { return str.split(re).filter(common_1.identity); };
}
exports.splitOnDelim = splitOnDelim;
/**
 * Reduce fn that joins neighboring strings
 *
 * Given an array of strings, returns a new array
 * where all neighboring strings have been joined.
 *
 * #### Example:
 * ```js
 * let arr = ["foo", "bar", 1, "baz", "", "qux" ];
 * arr.reduce(joinNeighborsR, []) // ["foobar", 1, "bazqux" ]
 * ```
 */
function joinNeighborsR(acc, x) {
    if (predicates_1.isString(common_1.tail(acc)) && predicates_1.isString(x))
        return acc.slice(0, -1).concat(common_1.tail(acc) + x);
    return common_1.pushR(acc, x);
}
exports.joinNeighborsR = joinNeighborsR;
//# sourceMappingURL=strings.js.map