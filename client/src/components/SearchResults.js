import React from "react";
import "./SearchResults.css";

const SearchResults = ({ results, onSelect }) => {
  return (
    <div className="search-results-container">
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((item) => (
            <li
              key={item.id || item.place_name || item.address_name}
              onClick={() => {
                onSelect(item); // 클릭 시 부모 컴포넌트의 상태를 변경하도록 호출
              }}
            >
              <strong>{item.place_name || item.address_name}</strong>
              <br />
              {item.address_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
