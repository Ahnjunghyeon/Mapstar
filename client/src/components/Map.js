import React, { useRef, useState, useEffect } from "react";
import MapCategory from "./MapCategory";
import MapSearch from "./MapSearch";
import AddressSearch from "./AddressSearch";
import RegionModal from "./RegionModal";
import "./Map.css";

const Map = () => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [address, setAddress] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  // 위치 서울시청 고정 --
  const initialPosition = new window.kakao.maps.LatLng(37.5665, 126.978);
  const initialLevel = 5;

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=dbcb1d68fd3c35a30fe94a2c6307b7ef&libraries=services,clusterer,drawing,geometry";
    script.onload = () => {
      const container = mapContainer.current;
      const options = {
        center: initialPosition,
        level: initialLevel,
      };

      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (selectedRegion && map) {
      const { lat, lng } = selectedRegion;
      const newPosition = new window.kakao.maps.LatLng(lat, lng);
      map.setCenter(newPosition);
    }
  }, [selectedRegion, map]);

  const resetMapPosition = () => {
    if (!map) return;

    map.setLevel(initialLevel);
    map.panTo(initialPosition);

    if (marker) {
      marker.setMap(null);
      setMarker(null);
    }

    setSearchResults(null);
    setAddress("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="map-container">
      {isModalOpen && (
        <RegionModal
          setSelectedRegion={setSelectedRegion}
          closeModal={closeModal}
        />
      )}

      <MapCategory map={map} />
      <MapSearch map={map} setMarker={setMarker} />
      <AddressSearch
        map={map}
        setMarker={setMarker}
        searchResults={searchResults}
        setSearchResults={setSearchResults}
        address={address}
        setAddress={setAddress}
      />

      <button onClick={resetMapPosition} className="reset-button">
        ⟳
      </button>

      <div ref={mapContainer} className="map"></div>
    </div>
  );
};

export default Map;
