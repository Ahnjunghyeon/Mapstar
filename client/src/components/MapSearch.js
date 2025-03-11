import React, { useState, useEffect } from "react";
import "./MapSearch.css"; // css 파일 import

const MapSearch = ({
  map,
  setMarker,
  handleSearchResults,
  handleAddressChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const executeSearch = () => {
    if (!searchTerm) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    const ps = new window.kakao.maps.services.Places();

    geocoder.addressSearch(searchTerm, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSuggestions(result);
        handleSearchResults(result);
      }
    });

    ps.keywordSearch(searchTerm, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSuggestions(data);
        handleSearchResults(data);
      }
    });
  };

  useEffect(() => {
    executeSearch();
  }, [searchTerm]);

  return (
    <div className="map-search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="주소 또는 상호명 검색"
        className="search-input"
      />
      <button onClick={executeSearch} className="search-button">
        검색
      </button>
      {errorMessage && (
        <div className="error-message">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default MapSearch;
