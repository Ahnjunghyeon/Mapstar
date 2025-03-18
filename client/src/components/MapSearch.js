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
  searchHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchHistoryRef = useRef(null);

  // 🔹 외부 클릭 시 검색 기록 창 닫기
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 자동완성 검색
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    const ps = new window.kakao.maps.services.Places();

    const fetchSuggestions = async () => {
      try {
        const [geocodeResults, placesResults] = await Promise.all([
          new Promise((resolve) =>
            geocoder.addressSearch(searchTerm, (res, status) =>
              resolve(
                status === window.kakao.maps.services.Status.OK ? res : []
              )
            )
          ),
          new Promise((resolve) =>
            ps.keywordSearch(searchTerm, (data, status) =>
              resolve(
                status === window.kakao.maps.services.Status.OK ? data : []
              )
            )
          ),
        ]);

        setSuggestions([...geocodeResults, ...placesResults]);
      } catch (error) {
        console.error("자동완성 검색 오류:", error);
      }
    };

    fetchSuggestions();
  }, [searchTerm]);

  // 🔹 검색 실행 함수
  const executeSearch = async (term) => {
    if (!term.trim()) return;
    setSearchTerm(term);

    const geocoder = new window.kakao.maps.services.Geocoder();
    const ps = new window.kakao.maps.services.Places();

    try {
      const [geocodeResult, placesResult] = await Promise.all([
        new Promise((resolve) =>
          geocoder.addressSearch(term, (res, status) =>
            resolve(status === window.kakao.maps.services.Status.OK ? res : [])
          )
        ),
        new Promise((resolve) =>
          ps.keywordSearch(term, (data, status) =>
            resolve(status === window.kakao.maps.services.Status.OK ? data : [])
          )
        ),
      ]);

      const combinedResults = [...geocodeResult, ...placesResult];
      handleSearchResults({ results: combinedResults, searchTerm: term });

      if (combinedResults.length > 0) {
        onSelect(combinedResults[0]);
      }
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  // 🔹 검색어 선택 시 처리
  const handleSelect = (item) => {
    const selectedTerm = item.place_name || item.address_name;
    setSearchTerm(selectedTerm);
    setSuggestions([]);
    onSelect(item);

    if (isLoggedIn && user) saveSearchHistory(user.id, selectedTerm);
    executeSearch(selectedTerm);
  };

  // 🔹 검색 기록 저장
  const saveSearchHistory = async (userId, term) => {
    if (!userId || !term.trim()) return;
    try {
      await axios.post("http://localhost:5000/api/search-history", {
        userId,
        searchTerm: term,
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("검색 기록 저장 오류:", error);
    }
  };

  const handleCloseHistory = () => {
    setShowHistory(false); // 검색 기록 닫기
  };

  return (
    <div className="map-search-container">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && executeSearch(searchTerm)}
        placeholder="주소 또는 상호명 검색"
        className="search-input"
        onFocus={() => setShowHistory(true)}
      />

      <button
        onClick={() => executeSearch(searchTerm)}
        className="search-button"
      >
        검색
      </button>

      {/* 🔹 자동완성 및 검색 기록 표시 */}
      <div className="autocomplete-suggestions">
        {/* 자동완성 결과가 있을 때 */}
        {suggestions.length > 0 && (
          <ul>
            {suggestions.map((item, index) => (
              <li key={index} onClick={() => handleSelect(item)}>
                {item.place_name || item.address_name}
              </li>
            ))}
          </ul>
        )}

        {/* 자동완성 결과가 없을 때 검색 기록 표시 */}
        {suggestions.length === 0 &&
          searchHistory.length > 0 &&
          showHistory && (
            <div ref={searchHistoryRef}>
              <SearchHistory
                user={user}
                isLoggedIn={isLoggedIn}
                onSearchHistoryClick={executeSearch}
                closeHistory={handleCloseHistory} // 닫기 버튼 클릭 시 호출
              />
            </div>
          )}

        {/* 🔹 자동완성 닫기 버튼 추가 */}
        {suggestions.length > 0 && (
          <button
            className="close-suggestions"
            onClick={() => setSuggestions([])}
          >
            ▲ 닫기
          </button>
        )}
      </div>
    </div>
  );
};

export default MapSearch;
