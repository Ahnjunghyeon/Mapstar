import React, { useState } from "react";
import axios from "axios";
import "./Modal.css";

const LoginModal = ({ closeModal, loginUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      alert(response.data.message);

      // 로그인 후 유저 정보 저장
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // loginUser 함수 호출하여 App.js로 로그인된 사용자 정보 전달
      loginUser(response.data.user);

      // 모달 닫기
      closeModal();
    } catch (error) {
      console.error("로그인 실패:", error); // 오류 로그 추가
      setError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
