import React, { useState, useEffect } from "react";
import SearchResults from "./SearchResults";

const MapSearch = ({
  map,
  setMarker,
  handleSearchResults,
  handleAddressChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (searchTerm) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const ps = new window.kakao.maps.services.Places();

      geocoder.addressSearch(searchTerm, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSuggestions(result);
        }
      });

      ps.keywordSearch(searchTerm, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSuggestions(data);
        }
      });
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSelectResult = (item) => {
    setSearchTerm(item.place_name || item.address_name);
    setSuggestions([]);

    const position = new window.kakao.maps.LatLng(item.y, item.x);

    if (currentMarker) {
      currentMarker.setMap(null);
    }

    const newMarker = new window.kakao.maps.Marker({
      position,
      map,
    });
    newMarker.setMap(map);

    map.panTo(position);

    setCurrentMarker(newMarker);
    setSearchTerm("");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="주소 또는 상호명 검색"
        style={{ padding: "8px", width: "300px", marginBottom: "10px" }}
      />
      <button onClick={() => {}} style={{ padding: "8px", marginLeft: "10px" }}>
        검색
      </button>
      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <p>{errorMessage}</p>
        </div>
      )}
      <SearchResults results={suggestions} onSelect={handleSelectResult} />
    </div>
  );
};

export default MapSearch;
