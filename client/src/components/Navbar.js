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
        <h1 className="navbar-logo">MapStar</h1>
        <div className="navbar-links">
          {isLoggedIn ? (
            <>
              <span className="navbar-user">{user.username}</span>
              <button onClick={logoutUser} className="navbar-logout">
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
