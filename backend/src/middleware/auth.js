"use strict";

/**
 * Authentication middleware
 * Attaches to any route that requires a logged-in session.
 */
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized. Please log in." });
}

module.exports = { requireAuth };
