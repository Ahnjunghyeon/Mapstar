import React from "react";
import "./SearchHistory.css";

const SearchHistory = ({ searchHistory }) => {
  if (!searchHistory || searchHistory.length === 0) {
    return <div className="no-history-message">검색 기록이 없습니다.</div>;
  }

  const sortedHistory = [...searchHistory].sort((a, b) => {
    const timeA = a.search_time ? new Date(a.search_time) : new Date(0);
    const timeB = b.search_time ? new Date(b.search_time) : new Date(0);
    return timeB - timeA;
  });

  return (
    <div className="search-history">
      <h3>검색 기록</h3>
      <ul>
        {sortedHistory.map((historyItem, index) => (
          <li key={index}>
            <span className="search-term">
              {historyItem.search_term
                ? historyItem.search_term
                : "검색어 없음"}
            </span>
            <span className="time">
              {historyItem.search_time
                ? new Date(historyItem.search_time).toLocaleString()
                : "시간 정보 없음"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;
