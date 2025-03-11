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
                onSelect(item);
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
