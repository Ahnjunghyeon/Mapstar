import React, { useRef, useState, useEffect } from "react";
import MapCategory from "./MapCategory";
import MapSearch from "./MapSearch";
import SearchResults from "./SearchResults";
import SelectedResult from "./SelectedResult";
import "./Map.css";

const Map = ({ selectedRegion, user, isLoggedIn }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCategoryActive, setIsCategoryActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);

    const position = new window.kakao.maps.LatLng(item.y, item.x);

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
    setSearchResults([]);
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

    setSearchResults([]);
    setSelectedItem(null);
  };

  const closeSelectedResult = () => {
    setSelectedItem(null);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
    if (!term) {
      setSearchResults([]);
    }
  };

  return (
    <div className="map-container">
      <MapCategory map={map} onCategoryChange={handleCategoryChange} />
      <MapSearch
        map={map}
        handleSearchResults={handleSearchResults}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchTermChange}
      />

      {/* 검색 결과가 있을 때만 보여지게 설정 */}
      {searchResults.length > 0 && (
        <SearchResults results={searchResults} onSelect={handleSelectItem} />
      )}

      <SelectedResult
        selectedItem={selectedItem}
        isLoggedIn={isLoggedIn}
        closeSelectedResult={closeSelectedResult}
      />
      <button onClick={resetMapPosition} className="reset-button">
        <img src="/reset-icon.png" alt="Reset Map" className="reset-icon" />
      </button>

      <div ref={mapContainer} className="map"></div>
    </div>
  );
};

export default Map;
