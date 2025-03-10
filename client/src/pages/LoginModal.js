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
      console.log("User Data:", response.data.user);

      // 로그인 성공 후, 로컬 스토리지에 사용자 정보 저장
      localStorage.setItem("user", JSON.stringify(response.data.user));

      loginUser(response.data.user); // 로그인 상태 업데이트
      closeModal(); // 모달 닫기
    } catch (error) {
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
