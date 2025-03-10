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

app.post("/api/save-marker", (req, res) => {
  const { userId, lat, lng, name, address } = req.body;

  const query =
    "INSERT INTO markers (user_id, lat, lng, name, address) VALUES (?, ?, ?, ?, ?)";
  connection.query(query, [userId, lat, lng, name, address], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Marker saved successfully" });
  });
});

app.get("/api/get-saved-markers", (req, res) => {
  const userId = req.query.userId; // 로그인한 유저 ID

  const query = "SELECT * FROM markers WHERE user_id = ?";
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

// 마커관련
app.post("/api/save-marker", (req, res) => {
  const { userId, lat, lng, name, address } = req.body;

  const query =
    "INSERT INTO markers (user_id, lat, lng, name, address) VALUES (?, ?, ?, ?, ?)";
  connection.query(query, [userId, lat, lng, name, address], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json({ message: "Marker saved successfully" });
  });
});
