const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS Configuration (Allows multiple origins)
const corsOptions = {
  origin: ["https://abdelghafour-elhalouani.netlify.app"], // Add other origins if needed
  methods: "GET,POST,PUT,DELETE",
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// ✅ MySQL Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// ✅ Improved Error Handling for Database Connection
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database");
  }
});

// ✅ Default Route for Testing (Fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully! 🚀");
});

// ✅ Get All Students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM etudiant", (err, results) => {
    if (err) {
      console.error("❌ Error fetching students:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// ✅ Get Student by ID
app.get("/students/:id", (req, res) => {
  db.query("SELECT * FROM etudiant WHERE id = ?", [req.params.id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching student:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(results[0]);
  });
});

// ✅ Add a New Student
app.post("/students", (req, res) => {
  const { nom, prenom, email, tel, date_naissance, filiere } = req.body;
  db.query(
    "INSERT INTO etudiant (nom, prenom, email, tel, date_naissance, filiere) VALUES (?, ?, ?, ?, ?, ?)",
    [nom, prenom, email, tel, date_naissance, filiere],
    (err, result) => {
      if (err) {
        console.error("❌ Error adding student:", err.message);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "✅ Étudiant ajouté avec succès", id: result.insertId });
    }
  );
});

// ✅ Update a Student
app.put("/students/:id", (req, res) => {
  const { nom, prenom, email, tel, date_naissance, filiere } = req.body;
  db.query(
    "UPDATE etudiant SET nom=?, prenom=?, email=?, tel=?, date_naissance=?, filiere=? WHERE id=?",
    [nom, prenom, email, tel, date_naissance, filiere, req.params.id],
    (err, result) => {
      if (err) {
        console.error("❌ Error updating student:", err.message);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json({ message: "✅ Étudiant mis à jour avec succès" });
    }
  );
});

// ✅ Delete a Student
app.delete("/students/:id", (req, res) => { 
  db.query("DELETE FROM etudiant WHERE id=?", [req.params.id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting student:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "✅ Étudiant supprimé avec succès" });
  });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
