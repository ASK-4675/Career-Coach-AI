"use strict";

/**
 * Wraps sqlite3 in promise-based helpers.
 * The underlying db instance uses sqlite3 callbacks,
 * but we expose .get(), .all(), .run(), .exec() as promises.
 */

const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const sqlite3 = require("sqlite3").verbose();

const DB_PATH = process.env.DB_PATH
  ? path.resolve(__dirname, "../../", process.env.DB_PATH)
  : path.join(__dirname, "../../data/careercoach.db");

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let _db = null;

function getRawDb() {
  if (!_db) {
    _db = new sqlite3.Database(DB_PATH);
    _db.run("PRAGMA journal_mode = WAL");
    _db.run("PRAGMA foreign_keys = ON");
  }
  return _db;
}

/** Promise wrappers */
const db = {
  get DB_PATH() { return DB_PATH; },

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      getRawDb().get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  },

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      getRawDb().all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  },

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      getRawDb().run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },

  exec(sql) {
    return new Promise((resolve, reject) => {
      getRawDb().exec(sql, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};

module.exports = db;
