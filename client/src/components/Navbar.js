// 임시
import React from "react";
import "./Navbar.css";

const Navbar = ({
  isLoggedIn,
  user,
  logoutUser,
  openLoginModal,
  openRegisterModal,
}) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">My App</h1>
        <div className="navbar-links">
          {isLoggedIn ? (
            <>
              <span className="navbar-link">Hello, {user.username}</span>
              <button onClick={logoutUser} className="navbar-link">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button onClick={openLoginModal} className="navbar-link">
                로그인
              </button>
              <button onClick={openRegisterModal} className="navbar-link">
                회원가입
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
