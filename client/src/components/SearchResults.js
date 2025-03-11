import React from "react";

const SearchResults = ({ results, onSelect }) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
      {results.map((item) => (
        <li
          key={item.id || item.place_name || item.address_name}
          style={{
            padding: "8px",
            background: "#f9f9f9",
            cursor: "pointer",
            borderRadius: "4px",
            marginBottom: "5px",
            border: "1px solid #ddd",
          }}
          onClick={() => onSelect(item)}
        >
          <strong>{item.place_name || item.address_name}</strong>
          <br />
          {item.address_name}
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
