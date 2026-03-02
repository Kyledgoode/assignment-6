const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "database", "university.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to open database:", err.message);
    process.exit(1);
  }
});

function parseId(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) return null;
  return id;
}

function validateCourseBody(body) {
  const { courseCode, title, credits, description, semester } = body;

  if (typeof courseCode !== "string" || courseCode.trim() === "") return "courseCode is required";
  if (typeof title !== "string" || title.trim() === "") return "title is required";

  const creditsNum = Number(credits);
  if (!Number.isFinite(creditsNum) || !Number.isInteger(creditsNum) || creditsNum <= 0) {
    return "credits must be a positive integer";
  }

  if (typeof description !== "string" || description.trim() === "") return "description is required";
  if (typeof semester !== "string" || semester.trim() === "") return "semester is required";

  return null;
}

app.get("/api/courses", (req, res) => {
  db.all("SELECT * FROM courses;", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(rows);
  });
});

app.get("/api/courses/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid id" });

  db.get("SELECT * FROM courses WHERE id = ?;", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Course not found" });
    return res.status(200).json(row);
  });
});

app.post("/api/courses", (req, res) => {
  const validationError = validateCourseBody(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const { courseCode, title, credits, description, semester } = req.body;

  const sql = `
    INSERT INTO courses (courseCode, title, credits, description, semester)
    VALUES (?, ?, ?, ?, ?);
  `;

  db.run(
    sql,
    [courseCode.trim(), title.trim(), Number(credits), description.trim(), semester.trim()],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      return res.status(201).json({
        id: this.lastID,
        courseCode: courseCode.trim(),
        title: title.trim(),
        credits: Number(credits),
        description: description.trim(),
        semester: semester.trim()
      });
    }
  );
});

app.put("/api/courses/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid id" });

  const validationError = validateCourseBody(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const { courseCode, title, credits, description, semester } = req.body;

  const sql = `
    UPDATE courses
    SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
    WHERE id = ?;
  `;

  db.run(
    sql,
    [courseCode.trim(), title.trim(), Number(credits), description.trim(), semester.trim(), id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Course not found" });

      return res.status(200).json({
        id,
        courseCode: courseCode.trim(),
        title: title.trim(),
        credits: Number(credits),
        description: description.trim(),
        semester: semester.trim()
      });
    }
  );
});

app.delete("/api/courses/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: "Invalid id" });

  db.run("DELETE FROM courses WHERE id = ?;", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Course not found" });
    return res.status(204).send();
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Using database: university (file: ${dbPath})`);
});