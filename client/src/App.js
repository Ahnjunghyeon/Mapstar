import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import LoginModal from "./pages/LoginModal";
import RegisterModal from "./pages/RegisterModal";

const App = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      // 'undefined' 문자열 체크
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
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const loginUser = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
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
      {isLoginModalOpen && (
        <LoginModal closeModal={closeLoginModal} loginUser={loginUser} />
      )}
      {isRegisterModalOpen && <RegisterModal closeModal={closeRegisterModal} />}

      <Map user={user} isLoggedIn={isLoggedIn} userId={user?.id} />
    </div>
  );
};

export default App;
