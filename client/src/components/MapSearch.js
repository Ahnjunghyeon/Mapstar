import React, { useState, useEffect } from "react";
import SearchResults from "./SearchResults";
import axios from "axios";

const MapSearch = ({ map, userId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userId) {
      fetchRecentSearches();
    }
  }, [userId]);

  const fetchRecentSearches = async () => {
    try {
      const response = await axios.get(
        `/api/get-recent-searches?userId=${userId}`
      );
      setRecentSearches(response.data.map((item) => item.search_term));
    } catch (error) {
      console.error("Failed to fetch recent searches", error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) return;

    if (userId) {
      await axios.post("/api/save-search", { userId, searchTerm });
      fetchRecentSearches(); // 검색어 저장 후 목록 갱신
    }

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

    setShowRecent(false);
  };

  const handleSelectResult = (item) => {
    setSearchTerm(item.place_name || item.address_name);
    setSuggestions([]);
    setShowRecent(false);

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
  };

  return (
    <div style={{ marginTop: "20px", position: "relative" }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowRecent(true)}
        onMouseEnter={() => setShowRecent(true)}
        onBlur={() => setTimeout(() => setShowRecent(false), 200)}
        placeholder="주소 또는 상호명 검색"
        style={{ padding: "8px", width: "300px", marginBottom: "10px" }}
      />
      <button
        onClick={handleSearch}
        style={{ padding: "8px", marginLeft: "10px" }}
      >
        검색
      </button>

      {showRecent && recentSearches.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0",
            width: "300px",
            maxHeight: "200px",
            overflowY: recentSearches.length > 8 ? "scroll" : "visible",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            zIndex: 10,
          }}
        >
          <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
            {recentSearches.map((term, index) => (
              <li
                key={index}
                style={{
                  padding: "5px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                }}
                onClick={() => {
                  setSearchTerm(term);
                  handleSearch();
                }}
              >
                {term}
              </li>
            ))}
          </ul>
        </div>
      )}

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
