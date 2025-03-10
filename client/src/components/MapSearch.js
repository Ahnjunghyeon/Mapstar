import React, { useState, useEffect } from "react";

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

  const handleSuggestionClick = (item) => {
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

  const handleSearchButtonClick = () => {
    if (searchTerm) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const ps = new window.kakao.maps.services.Places();

      let searchResults = [];

      geocoder.addressSearch(searchTerm, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          searchResults = searchResults.concat(result);
        }
      });

      ps.keywordSearch(searchTerm, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          searchResults = searchResults.concat(data);
        }

        if (searchResults.length === 0) {
          setErrorMessage("해당하는 곳이 없습니다.");
        } else {
          searchResults = searchResults.sort((a, b) => {
            const aContainsSearchTerm = (
              a.place_name || a.address_name
            ).includes(searchTerm);
            const bContainsSearchTerm = (
              b.place_name || b.address_name
            ).includes(searchTerm);

            if (aContainsSearchTerm && !bContainsSearchTerm) {
              return -1;
            } else if (!aContainsSearchTerm && bContainsSearchTerm) {
              return 1;
            }

            const aSimilarity = getStringSimilarity(
              searchTerm,
              a.place_name || a.address_name
            );
            const bSimilarity = getStringSimilarity(
              searchTerm,
              b.place_name || b.address_name
            );
            return bSimilarity - aSimilarity;
          });

          setSuggestions(searchResults);

          const position = new window.kakao.maps.LatLng(
            searchResults[0].y,
            searchResults[0].x
          );

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
          setErrorMessage("");
        }
      });
    }
  };

  const getStringSimilarity = (str1, str2) => {
    let commonLength = 0;
    const length1 = str1.length;
    const length2 = str2.length;

    for (let i = 0; i < Math.min(length1, length2); i++) {
      if (str1[i] === str2[i]) {
        commonLength++;
      }
    }

    return commonLength / Math.max(length1, length2);
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
      <button
        onClick={handleSearchButtonClick}
        style={{ padding: "8px", marginLeft: "10px" }}
      >
        검색
      </button>
      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>
          <p>{errorMessage}</p>
        </div>
      )}
      {suggestions.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
          {suggestions.map((item) => (
            <li
              key={item.id || item.place_name || item.address_name}
              style={{
                padding: "5px",
                background: "#f0f0f0",
                cursor: "pointer",
                borderRadius: "4px",
                marginBottom: "5px",
              }}
              onClick={() => handleSuggestionClick(item)}
            >
              {item.place_name || item.address_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MapSearch;
