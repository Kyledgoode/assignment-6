const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, "university.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not create/open database:', err.message);
    process.exit(1);
    }
});

const createCoursesTable = `
    DROP TABLE IF EXISTS courses;
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseCode TEXT NOT NULL,
        title TEXT NOT NULL,
        credits INTEGER NOT NULL,
        description TEXT NOT NULL,
        semester TEXT NOT NULL
    );
`;

db.run(createCoursesTable, (err) => {
    if (err) {
        console.error('Could not create courses table:', err.message);
        db.close();
        process.exit(1);
    }

    console.log('Courses table created successfully.');

    db.close((closeErr) => {
        if (closeErr) console.error('Error closing the database:', closeErr.message);
    });
});