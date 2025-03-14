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
    console.error("데이터베이스 연결 오류:", err.stack);
    return;
  }
  console.log("데이터베이스에 연결됨, ID: " + connection.threadId);
});

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  const checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
  connection.query(checkUsernameQuery, [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "데이터베이스 오류" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "이미 존재하는 사용자명입니다" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    connection.query(
      query,
      [username, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "데이터베이스 오류" });
        }
        res
          .status(201)
          .json({ message: "사용자가 성공적으로 등록되었습니다!" });
      }
    );
  });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "데이터베이스 오류" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "잘못된 이메일 또는 비밀번호" });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "잘못된 이메일 또는 비밀번호" });
    }

    res.status(200).json({
      message: "로그인 성공",
      user: { id: user.id, username: user.username, email: user.email },
    });
  });
});

app.get("/api/users", (req, res) => {
  res.status(400).json({ error: "로그인 상태 확인 방법이 필요합니다." });
});

app.post("/api/search-history", (req, res) => {
  const { userId, searchTerm } = req.body;

  if (!userId || !searchTerm) {
    return res.status(400).json({ error: "userId와 searchTerm이 필요합니다." });
  }

  const query =
    "INSERT INTO search_history (user_id, search_term) VALUES (?, ?)";
  connection.query(query, [userId, searchTerm], (err, results) => {
    if (err) {
      console.error("검색 기록 저장 오류:", err);
      return res.status(500).json({ error: "데이터베이스 오류" });
    }
    res.status(201).json({ message: "검색 기록이 저장되었습니다." });
  });
});

app.get("/api/search-history", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "userId가 필요합니다." });
  }

  const query =
    "SELECT * FROM search_history WHERE user_id = ? ORDER BY search_time DESC";
  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error("검색 기록 조회 오류:", err);
      return res.status(500).json({ error: "데이터베이스 오류" });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다`);
});
