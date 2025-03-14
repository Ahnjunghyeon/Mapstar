import React, { useState, useEffect } from "react";
import axios from "axios";
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

  // 자동완성 데이터 가져오기
  useEffect(() => {
    if (!searchTerm.trim() || isAutoCompleteSelected) {
      setSuggestions([]);
      return;
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
  }, [searchTerm, isAutoCompleteSelected]);

  // 검색 기록 가져오기
  useEffect(() => {
    if (isLoggedIn && user) {
      const fetchSearchHistory = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/search-history?userId=${user.id}` // userId를 쿼리 파라미터로 전달
          );
          setSearchHistory(response.data); // 검색 기록을 상태로 설정
        } catch (error) {
          console.error("검색 기록 로드 실패:", error);
        }
      };

      fetchSearchHistory(); // 검색 기록 가져오기
    }
  }, [isLoggedIn, user]);

  // 검색 실행 함수
  const executeSearch = async () => {
    if (!searchTerm.trim()) return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    const ps = new window.kakao.maps.services.Places();

    const geocodeSearch = new Promise((resolve, reject) => {
      geocoder.addressSearch(searchTerm, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve(result);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          // 결과가 없을 경우 빈 배열을 반환
          resolve([]);
        } else {
          // 다른 오류 상태일 때만 경고 출력
          console.warn("주소 검색 실패", status);
          resolve([]); // 오류가 발생하면 빈 배열을 반환하여 계속 진행
        }
      });
    });

    const placesSearch = new Promise((resolve, reject) => {
      ps.keywordSearch(searchTerm, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          resolve(data);
        } else {
          console.warn("키워드 검색 실패", status);
          resolve([]); // 오류가 발생하면 빈 배열을 반환하여 계속 진행
        }
      });
    });

    // 두 검색 결과를 하나로 합쳐서 처리
    try {
      const [geocodeResult, placesResult] = await Promise.all([
        geocodeSearch,
        placesSearch,
      ]);
      const combinedResults = [...geocodeResult, ...placesResult]; // 둘의 결과를 합침
      const searchData = { results: combinedResults, searchTerm };

      handleSearchResults(searchData); // 결과 전달
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };

  // 장소 선택 시
  const handleSelect = (item) => {
    setSearchTerm(item.place_name || item.address_name);
    setSuggestions([]);
    setIsAutoCompleteSelected(true);
    onSelect(item);

    // 자동완성에서 선택했을 때만 저장
    if (isLoggedIn && user) {
      saveSearchHistory(user.id, item.place_name || item.address_name);
    }

    executeSearch();
  };

  // 검색 기록 저장 함수
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

  // 사용자가 직접 입력한 경우 자동완성 기능 다시 활성화
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsAutoCompleteSelected(false);
  };

  // 엔터 키 입력 시 검색 실행
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
      />
      <button onClick={executeSearch} className="search-button">
        검색
      </button>

      <div className="autocomplete-suggestions">
        {/* 검색창이 비어 있을 때는 검색 기록, 아닐 때는 자동완성 */}
        {searchTerm.trim() === "" ? (
          <ul>
            {searchHistory.length === 0 ? (
              <li>검색기록이 없습니다.</li> // 검색 기록이 없으면 이 메시지를 표시
            ) : (
              searchHistory.map((historyItem, index) => (
                <li
                  key={index}
                  onClick={() => setSearchTerm(historyItem.searchTerm)}
                >
                  {historyItem.searchTerm}
                </li>
              ))
            )}
          </ul>
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
      </div>
    </div>
  );
};

export default MapSearch;
