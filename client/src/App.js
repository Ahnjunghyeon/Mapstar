import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Map from "./components/Map";
import RegionModal from "./components/RegionModal";
import LoginModal from "./pages/LoginModal";
import RegisterModal from "./pages/RegisterModal";

function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

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
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    setUser(null);
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

      <Map selectedRegion={selectedRegion} />
    </div>
  );
}

export default App;
