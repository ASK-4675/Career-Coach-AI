"use strict";

const { validationResult } = require("express-validator");

/**
 * Returns a middleware that runs express-validator and aborts with 422 if invalid.
 */
function validate(rules) {
  return async (req, res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: "Validation failed", details: errors.array() });
    }
    next();
  };
}

module.exports = { validate };
