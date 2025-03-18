import React, { useState } from "react";
import axios from "axios";
import "./Modal.css";

const LoginModal = ({ closeModal, loginUser, openRegisterModal }) => {
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

      localStorage.setItem("user", JSON.stringify(response.data.user));

      loginUser(response.data.user);
      closeModal(); // 로그인 성공 후 모달 닫기
    } catch (error) {
      console.error("로그인 실패:", error);
      setError(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>로그인</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="modal-input"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="modal-input"
          />
          <button type="submit">로그인</button>
        </form>
        <p>
          계정이 없으신가요?{" "}
          <span className="register-link" onClick={openRegisterModal}>
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
