import React, { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import RegionModal from "./components/RegionModal";

function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <h1>지도</h1>

      {isModalOpen && (
        <RegionModal
          setSelectedRegion={setSelectedRegion}
          closeModal={closeModal}
        />
      )}

      <Map selectedRegion={selectedRegion} />
    </div>
  );
}

export default App;
