
var error = {};

var AssertionError = function (message, actual, expected) {
  this.message = message;
  this.actual = actual;
  this.expected = expected;
  this.showDiff = true;
};
AssertionError.prototype = Object.create(Error.prototype);
AssertionError.prototype.name = 'AssertionError';
AssertionError.prototype.constructor = AssertionError;

error.InvalidKey = function(actual, expected){
  const msg = `InvalidKey: expected ${JSON.stringify(actual)} to match ${JSON.stringify(expected)}`;
  const err = new AssertionError(msg, actual, expected);
  err.InvalidKey = true;
  err.key = actual;
  return err;
};

error.InvalidLength = function(actual, expected, key){
  const msg = `InvalidLength: expected ${actual} to match ${expected}`;
  const err = new AssertionError(msg, actual, expected);
  err.InvalidLength = true;
  err.expected = expected;
  err.actual = actual;
  if (key != null){
    err.key = key;
  }
  return err;
};

error.MismatchedValue = function(actual, expected, key){
  const err = new AssertionError(
    `MismatchedValue: expected ${JSON.stringify(actual)} to match ${JSON.stringify(expected)}`,
    actual,
    expected
  );
  err.MismatchedValue = true;
  if (key != null){
    err.key = key;
  }
  return err;
};

error.MissingValue = function(expected, key){
  const err = new AssertionError(`MissingValue: expected ${JSON.stringify(expected)} to exist at key ${JSON.stringify(key)}`, undefined, expected);
  err.MissingValue = true;
  err.key = key;
  return err;
};

error.UnexpectedValue = function(actual, key){
  const err = new AssertionError(`UnexpectedValue: did not expect ${JSON.stringify(actual)} to exist at key ${JSON.stringify(key)}`, actual, undefined);
  err.UnexpectedValue = true;
  err.key = key;
  return err;
};

module.exports = error;
