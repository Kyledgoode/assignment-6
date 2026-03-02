// dbcheck.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database", "university.db"); // <-- FIX
console.log("CHECK DB PATH:", dbPath);

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, tables) => {
    if (err) {
      console.error(err.message);
      db.close();
      return;
    }
    console.log("TABLES:", tables);

    db.get("SELECT COUNT(*) AS cnt FROM university;", [], (err2, row) => {
      if (err2) console.error("COUNT ERR:", err2.message);
      else console.log("university row count:", row.cnt);

      db.close();
    });
  });
});