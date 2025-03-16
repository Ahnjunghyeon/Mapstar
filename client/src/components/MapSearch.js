import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SearchHistory from "./SearchHistory";

import "./MapSearch.css";

const MapSearch = ({
  map,
  handleSearchResults,
  isLoggedIn,
  user,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isAutoCompleteSelected, setIsAutoCompleteSelected] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const searchHistoryRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn && user) {
      const fetchSearchHistory = async () => {
        try {
          console.log("📡 검색 기록 요청:", user.id);
          const response = await axios.get(
            `http://localhost:5000/api/search-history?userId=${user.id}`
          );
          console.log("✅ 검색 기록 응답:", response.data);
          setSearchHistory(response.data);
        } catch (error) {
          console.error(
            "❌ 검색 기록 로드 실패:",
            error.response ? error.response.data : error.message
          );
        }
      };

      fetchSearchHistory();
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchHistoryRef.current &&
        !searchHistoryRef.current.contains(event.target)
      ) {
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    const ps = new window.kakao.maps.services.Places();

    const fetchSuggestions = async () => {
      try {
        const geocodeResults = await new Promise((resolve, reject) => {
          geocoder.addressSearch(searchTerm, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              resolve(result);
            } else {
              resolve([]);
            }
          });
        });

        const placesResults = await new Promise((resolve, reject) => {
          ps.keywordSearch(searchTerm, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              resolve(data);
            } else {
              resolve([]);
            }
          });
        });

        const combinedResults = [...geocodeResults, ...placesResults].filter(
          (value, index, self) =>
            index === self.findIndex((v) => v.id === value.id)
        );

        setSuggestions(combinedResults);
      } catch (error) {
        console.error("자동완성 검색 오류:", error);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  const executeSearch = async () => {
    if (!searchTerm.trim()) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    const ps = new window.kakao.maps.services.Places();

    const geocodeSearch = new Promise((resolve, reject) => {
      geocoder.addressSearch(searchTerm, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve(result);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          resolve([]);
        } else {
          console.warn("주소 검색 실패", status);
          resolve([]);
        }
      });
    });

    const placesSearch = new Promise((resolve, reject) => {
      ps.keywordSearch(searchTerm, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve(data);
        } else {
          console.warn("키워드 검색 실패", status);
          resolve([]);
        }
      });
    });

    try {
      const [geocodeResult, placesResult] = await Promise.all([
        geocodeSearch,
        placesSearch,
      ]);
      const combinedResults = [...geocodeResult, ...placesResult];
      const searchData = { results: combinedResults, searchTerm };

      handleSearchResults(searchData);

      if (combinedResults.length > 0) {
        const firstResult = combinedResults[0];
        onSelect(firstResult);
      }
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  const handleSelect = (item) => {
    setSearchTerm(item.place_name || item.address_name);
    setSuggestions([]);
    setIsAutoCompleteSelected(true);
    onSelect(item);

    if (isLoggedIn && user) {
      saveSearchHistory(user.id, item.place_name || item.address_name);
    }

    executeSearch();
  };

  const saveSearchHistory = async (userId, searchTerm) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/search-history",
        {
          userId,
          searchTerm,
          time: new Date().toISOString(),
        }
      );
      console.log("검색 기록 저장 완료", response.data);
    } catch (error) {
      console.error("검색 기록 저장 오류:", error);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsAutoCompleteSelected(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  return (
    <div className="map-search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="주소 또는 상호명 검색"
        className="search-input"
        onFocus={() => setShowHistory(true)}
      />

      <button onClick={executeSearch} className="search-button">
        검색
      </button>

      <div className="autocomplete-suggestions">
        {searchTerm.trim() === "" ? (
          <ul></ul>
        ) : (
          suggestions.length > 0 && (
            <ul>
              {suggestions.map((item, index) => (
                <li key={index} onClick={() => handleSelect(item)}>
                  {item.place_name || item.address_name}
                </li>
              ))}
            </ul>
          )
        )}

        {searchTerm.trim() === "" &&
          searchHistory.length > 0 &&
          showHistory && (
            <div ref={searchHistoryRef}>
              <SearchHistory user={user} isLoggedIn={isLoggedIn} />
            </div>
          )}
      </div>
    </div>
  );
};

export default MapSearch;
