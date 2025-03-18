import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import LoginModal from "./pages/LoginModal";
import RegisterModal from "./pages/RegisterModal";

const App = () => {
  const [currentModal, setCurrentModal] = useState(null); // 현재 열린 모달 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const openLoginModal = () => {
    setCurrentModal("login"); // 로그인 모달 열기
  };

  const openRegisterModal = () => {
    setCurrentModal("register"); // 회원가입 모달 열기
  };

  const closeModal = () => {
    setCurrentModal(null); // 모달 닫기
  };

  const loginUser = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
    closeModal(); // 로그인 성공 후 모달 닫기
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="App">
      <Navbar
        isLoggedIn={isLoggedIn}
        user={user}
        logoutUser={logoutUser}
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
      />

      {/* 모달 상태에 따라 렌더링 */}
      {currentModal === "login" && (
        <LoginModal
          closeModal={closeModal}
          loginUser={loginUser}
          openRegisterModal={openRegisterModal}
        />
      )}
      {currentModal === "register" && (
        <RegisterModal
          closeModal={closeModal}
          openLoginModal={openLoginModal}
        />
      )}

      <Map user={user} isLoggedIn={isLoggedIn} userId={user?.id} />
    </div>
  );
};

export default App;
