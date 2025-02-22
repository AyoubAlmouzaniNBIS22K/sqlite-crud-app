const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error("Error opening database", err.message);
    } else {
        console.log("Database connected");
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )`);
    }
});

// Create (Add user)
app.post("/add", (req, res) => {
    const { name, email } = req.body;
    db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// Read (Get users)
app.get("/users", (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

// Delete user
app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
