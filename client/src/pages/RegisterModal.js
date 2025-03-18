import React, { useState } from "react";
import axios from "axios";
import "./Modal.css";

const RegisterModal = ({ closeModal, openLoginModal }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        email,
        password,
      });

      alert(response.data.message);
      closeModal();
    } catch (error) {
      setError(error.response?.data?.error || "회원가입에 실패하였습니다.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h2>회원가입</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="이 름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="modal-input"
          />
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

          <button type="submit">회원가입</button>
        </form>
        <p>
          이미 계정이 있으신가요?{" "}
          <span className="login-link" onClick={openLoginModal}>
            로그인
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
