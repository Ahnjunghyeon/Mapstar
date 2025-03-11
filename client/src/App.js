import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import RegionModal from "./components/RegionModal";
import LoginModal from "./pages/LoginModal";
import RegisterModal from "./pages/RegisterModal";

const App = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const closeRegionModal = () => {
    setIsRegionModalOpen(false);
  };

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
    localStorage.setItem("user", JSON.stringify(userData));
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

      {isRegionModalOpen && (
        <RegionModal
          setSelectedRegion={setSelectedRegion}
          closeModal={closeRegionModal}
        />
      )}

      <Map
        selectedRegion={selectedRegion}
        user={user}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
};

export default App;
