import React, { useRef, useState, useEffect } from "react";
import MapCategory from "./MapCategory";
import MapSearch from "./MapSearch";
import "./Map.css";

const Map = ({ selectedRegion, user }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [address, setAddress] = useState("");
  const [isCategoryActive, setIsCategoryActive] = useState(false);

  const initialLevel = 5;

  useEffect(() => {
    const initialPosition = new window.kakao.maps.LatLng(37.5665, 126.978);

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

  const handleSearchResults = (results) => {
    setSearchResults(results);
    const position = new window.kakao.maps.LatLng(results.lat, results.lng);

    if (marker) {
      marker.setMap(null);
    }

    const newMarker = new window.kakao.maps.Marker({
      position: position,
      map: map,
    });
    newMarker.setMap(map);
    map.panTo(position);

    setMarker(newMarker);
  };

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleCategoryChange = (category) => {
    setIsCategoryActive(category !== null);
  };

  const resetMapPosition = () => {
    if (!map) return;

    const initialPosition = new window.kakao.maps.LatLng(37.5665, 126.978);
    map.setLevel(initialLevel);
    map.panTo(initialPosition);

    if (marker) {
      marker.setMap(null);
      setMarker(null);
    }

    setSearchResults(null);
    setAddress("");
  };

  return (
    <div className="map-container">
      <MapCategory map={map} onCategoryChange={handleCategoryChange} />

      <MapSearch
        map={map}
        setMarker={setMarker}
        handleSearchResults={handleSearchResults}
        handleAddressChange={handleAddressChange}
      />

      <button onClick={resetMapPosition} className="reset-button">
        ⟳
      </button>
      <div ref={mapContainer} className="map"></div>
    </div>
  );
};

export default Map;
