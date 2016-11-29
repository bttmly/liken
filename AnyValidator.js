class AnyValidator {

  /* @schema : basically anything that will denote
   * that this validator should be used.
   *
   * Creates a validator.
   **/
  constructor (schema) {
    if (!AnyValidator.identify(schema)){
      throw new Error("Invalid schema for validator");
    }
    this.schema = {};
  }

  /* @input takes some input to validate against the schema
   *
   * Returns a boolean indicating whether or not the schema
   * was passed.
   */
  validate (input) {
    return true;
  }

  /* @input takes some input to validate against the schema
   *
   * throws an Error if the validation failed.  Returns
   * null otherwise.
   **/
  assert (input) {
  }

  /* returns a JSON representation of the schema. */
  toJSON () {
    this.schema = this.schema; // trick the linter
    return {'#any' : {}};
  }

  /* @schema : basically anything that will denote that this
   * validator should be used.
   *
   * returns true if this validator should be used.
   */
  static identify (schema) {
    if (schema && schema['#any']){
      return true;
    }
    return false;
  }

}

module.exports = AnyValidator;
