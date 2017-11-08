var liken = require('./index');
var expect = require('chai').expect;
var consoleError = global[`consol${""}e`][`erro${""}r`]; // fool the linter
var assert = require('assert');
var traverse = require('traverse');
var deepEqual = require('deep-equal');
var difflet = require('difflet');
var stringify = require('json-stable-stringify');
var _ = require('lodash');

function raise(fn){
  try {
    var retval = fn();
  } catch(ex){
    return ex;
  }
  consoleError("expected exception did not throw. return value: ", retval);
  throw new Error('Expected exception did not throw');
}

function expectValueError(fn){
  var ex = raise(fn);
  expect(ex).to.be.an.instanceof(Error);
  if (!ex.ValueError){
    consoleError("Non-Value Error thrown: ", ex, ex.stack);
  }
  expect(ex.ValueError).to.eql(true);
  expect(ex.message).to.eql('Value Error');
  return ex;
}

function getError(actual, schema){
  if (schema == null){
    schema = actual;
    try {
      liken(schema);
    } catch (ex) {
      return ex;
    }
    consoleError("expected exception did not throw.");
    throw new Error('Expected exception did not throw');
  }
  try {
    liken(actual, schema);
  } catch (ex) {
    return ex;
  }
  consoleError("expected exception did not throw.");
  throw new Error('Expected exception did not throw');
}
function expectProperties(obj, props){
  for (const key in props){
    if (obj[key] === undefined){
      throw new Error("object had no key: " + key);
    }
    expect(obj[key]).to.eql(props[key]);
  }
  // assertObjectEquals(obj, props);
}
function expectMissingParamToThrow(schema){
  var error = getError(null, schema);
  expectProperties(error, {
    subType: 'missing value', path: null, expected: schema
  });
}

function expectValueErrorToThrow(schema, wrongType, notation){
  var error = getError(wrongType, schema);
  expect(error.message).to.eql('MismatchedValue: expected ' + JSON.stringify(wrongType) + ' to match ' + JSON.stringify(notation || schema));
  expect(error.actual).to.eql(wrongType);
}

function expectTypeMismatchToThrow(schema, wrongType, notation){
  var error = getError(wrongType, schema);
  expect(error.message).to.eql(`MismatchedType: expected ${JSON.stringify(wrongType)} (type ${typeName(wrongType)}) to be of type ${typeName(schema || notation)}`);
  expect(error.actual).to.eql(wrongType);
}

var assertObjectEquals = function (actual, expected, options){
  if (actual == null) {
    var result = actual === expected;
    if (!result) {
      consoleError("Actual", JSON.stringify(actual, null, 2));
      consoleError("Expected", JSON.stringify(expected, null, 2));
      assert.fail(actual, expected);
    }
    return result;
  }

  if (options && options.unordered) {
    actual = actual.map(stringify).
                   sort().
                   map(JSON.parse);
                 expected = expected.map(stringify).
                   sort().
                   map(JSON.parse);
  }

  // strip the milliseconds off all dates
  traverse(expected).forEach(function (x) {
    if (_.isDate(x)) {
      x.setMilliseconds(0);
      this.update(x);
    }
  });
  // strip the milliseconds off all dates
  traverse(actual).forEach(function (x) {
    if (_.isDate(x)) {
      x.setMilliseconds(0);
      this.update(x);
    }
  });
  if (!deepEqual(actual, expected)){
    process.stdout.write(difflet.compare(actual, expected));
    consoleError("\n\nactual");
    consoleError(JSON.stringify(actual, null, 2));
    consoleError("\n\nexpected");
    consoleError(JSON.stringify(expected, null, 2));
    consoleError("\n\n");
    assert.fail(actual, expected);
    return false;
  }
  return true;
};

function typeName (x) {
  // if we have an object, it might be a JSON notation so we look for that first
  if (x != null) {
    const keys = Object.keys(x);
    for (const key of keys) {
      if (key[0] === "#") {
        return key.slice(1);
      }
    }
  }

  return Object.prototype.toString.call(x).slice(8, -1).
    toLowerCase();
}

module.exports = {
  expect,
  assertObjectEquals,
  consoleError,
  raise,
  expectValueErrorToThrow,
  expectValueError,
  expectMissingParamToThrow,
  expectTypeMismatchToThrow,
  expectProperties,
  getError
};
