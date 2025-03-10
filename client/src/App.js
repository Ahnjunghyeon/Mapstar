import React, { useState } from "react";
import "./App.css";
import Map from "./components/Map";
import RegionModal from "./components/RegionModal";
import MapSearch from "./components/MapSearch";
import AddressSearch from "./components/AddressSearch";

function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [address, setAddress] = useState("");

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

      <MapSearch map={selectedRegion?.map} />
      <AddressSearch
        map={selectedRegion?.map}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        address={address}
        setAddress={setAddress}
      />
    </div>
  );
}

export default App;
