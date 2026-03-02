const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not create/open database:', err.message);
    process.exit(1);
    }
});

const createUniversityTable = `
    CREATE TABLE IF NOT EXISTS university (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseCode TEXT NOT NULL,
        title TEXT NOT NULL,
        credits INTEGER NOT NULL,
        description TEXT NOT NULL,
        semester TEXT NOT NULL
    );
`;

db.run(createUniversityTable, (err) => {
    if (err) {
        console.error('Could not create university table:', err.message);
        db.close();
        process.exit(1);
    }

    console.log('University table created successfully.');

    db.close((closeErr) => {
        if (closeErr) console.error('Error closing the database:', closeErr.message);
    });
});