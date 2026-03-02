const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, "university.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
    }
});

const clearSQL = `DELETE FROM courses;`;
const insertSQL = `
    INSERT INTO courses (courseCode, title, credits, description, semester) 
    VALUES (?, ?, ?, ?, ?);
`;

const coursesIncluded =  [
    ["CS101", "Intro Programming", 3, "Learn Python basics", "Fall 2024"],
  ["BIO120", "General Biology", 3, "Introduction to biological principles", "Fall 2024"],
  ["MATH150", "Calculus I", 4, "Basic calculus", "Fall 2024"],
  ["ENG101", "Composition I", 3, "Academic writing and critical thinking", "Spring 2025"],
  ["ME210", "Thermodynamics", 3, "Principles of thermodynamics and heat transfer", "Spring 2025"],
  ["CS301", "Database Systems", 3, "Design and implementation of database systems", "Fall 2024"],
  ["PHYS201", "Physics II", 4, "Electricity, magnetism, and modern physics", "Spring 2025"],
  ["CS201", "Data Structures", 4, "Study of fundamental data structures and algorithms", "Spring 2025"]
];

db.serialize(() => {
    db.run(clearSQL, (err) => {
        if (err) { 
            console.error('Error clearing courses table:', err.message);
            db.close();
            process.exit(1);
        }

        const stmt = db.prepare(insertSQL);

        for (const c of coursesIncluded) {
            stmt.run(c, (insertErr) => {
                if (insertErr) {
                    console.error('Error inserting course:', insertErr.message);
                }
            });
        }

        stmt.finalize((finalizeErr) => {
            if (finalizeErr) {
                console.error('Error finalizing statement:', finalizeErr.message);
            }
        
            console.log('Database seeded successfully.');

            db.close((closeErr) => {
                if (closeErr) console.error('Error closing the database:', closeErr.message);
            });
        });
    });
});