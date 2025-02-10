const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    host: "roundhouse.proxy.rlwy.net", 
    user: "root",
    password: "wUBybWnXVaITRBPqTHEnXnJGTZQCxCfJ",
    database: "gestion_etudiants",
    port: 59152,
  });  

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
  } else {
    console.log("Connected to MySQL database");
  }
});

app.get("/students", (req, res) => {
  db.query("SELECT * FROM etudiant", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
app.get("/students/:id", (req, res) => {
  db.query("SELECT * FROM etudiant WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results[0]);
  });
});
app.post("/students", (req, res) => {
  const { nom, prenom, email, tel, date_naissance, filiere } = req.body;
  db.query(
    "INSERT INTO etudiant (nom, prenom, email, tel, date_naissance, filiere) VALUES (?, ?, ?, ?, ?, ?)",
    [nom, prenom, email, tel, date_naissance, filiere],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Étudiant ajouté avec succès", id: result.insertId });
    }
  );
});
app.put("/students/:id", (req, res) => {
  const { nom, prenom, email, tel, date_naissance, filiere } = req.body;
  db.query(
    "UPDATE etudiant SET nom=?, prenom=?, email=?, tel=?, date_naissance=?, filiere=? WHERE id=?",
    [nom, prenom, email, tel, date_naissance, filiere, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Étudiant mis à jour avec succès" });
    }
  );
});
app.delete("/students/:id", (req, res) => {
  db.query("DELETE FROM etudiant WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Étudiant supprimé avec succès" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
