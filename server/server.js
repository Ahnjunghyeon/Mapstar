const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database as id " + connection.threadId);
});

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const query =
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  connection.query(query, [username, email, hashedPassword], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "User registered successfully!" });
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email },
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.post("/api/save-search", (req, res) => {
  const { userId, searchTerm } = req.body;
  if (!userId || !searchTerm) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const query = `
    INSERT INTO search_history (user_id, search_term) 
    VALUES (?, ?) 
    ON DUPLICATE KEY UPDATE search_term = VALUES(search_term), updated_at = NOW()
  `;

  connection.query(query, [userId, searchTerm], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Search term saved successfully" });
  });
});

app.get("/api/get-recent-searches", (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "User ID required" });
  }

  const query = `
    SELECT search_term FROM search_history 
    WHERE user_id = ? 
    ORDER BY updated_at DESC 
    LIMIT 8
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});
