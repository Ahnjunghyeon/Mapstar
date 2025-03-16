import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SearchHistory.css";

const SearchHistory = ({ user, isLoggedIn }) => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);

  const fetchSearchHistory = async () => {
    if (!isLoggedIn || !user) return;

    try {
      console.log("📡 검색 기록 요청:", user.id);
      const response = await axios.get(
        `http://localhost:5000/api/search-history?userId=${user.id}`
      );
      console.log("✅ 검색 기록 응답:", response.data);
      setSearchHistory(response.data);
      setIsHistoryLoaded(true);
    } catch (error) {
      console.error(
        "❌ 검색 기록 로드 실패:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    if (isLoggedIn && user && !isHistoryLoaded) {
      fetchSearchHistory();
    }
  }, [isLoggedIn, user, isHistoryLoaded]);

  const handleDelete = async (e, searchTerm, searchTime) => {
    e.stopPropagation();

    const confirmDelete = window.confirm("정말 지우시겠습니까?");
    if (confirmDelete) {
      try {
        console.log("📡 삭제 요청:", searchTerm, searchTime);

        const response = await axios.delete(
          "http://localhost:5000/api/search-history",
          {
            data: {
              userId: user.id,
              searchTerm: searchTerm,
              searchTime: searchTime,
            },
          }
        );

        console.log("✅ 검색 기록 삭제 완료:", response.data);

        fetchSearchHistory();
      } catch (error) {
        console.error(
          "❌ 검색 기록 삭제 오류:",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      console.log("❌ 삭제 취소됨");
    }
  };

  return (
    <div className="search-history">
      <h3>검색 기록</h3>
      <ul>
        {searchHistory.map((historyItem, index) => (
          <li key={index} className="search-history-item">
            <span className="search-term">
              {historyItem.search_term || "검색어 없음"}
            </span>
            <span className="time">
              {historyItem.search_time
                ? new Date(historyItem.search_time).toLocaleString()
                : "시간 정보 없음"}
            </span>
            <button
              className="delete-button"
              onClick={(e) =>
                handleDelete(
                  e,
                  historyItem.search_term,
                  historyItem.search_time
                )
              }
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;
