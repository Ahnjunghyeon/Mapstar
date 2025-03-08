import React, { useState, useEffect } from "react";

const MapSearch = ({ map, setMarker }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [placeInfo, setPlaceInfo] = useState(null);

  useEffect(() => {
    if (searchTerm) {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(searchTerm, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      });
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSuggestionClick = (place) => {
    setSearchTerm(place.place_name);
    setSuggestions([]);

    const position = new window.kakao.maps.LatLng(place.y, place.x);

    if (placeInfo) {
      placeInfo.setMap(null);
    }

    const newMarker = new window.kakao.maps.Marker({
      position,
      map,
    });
    newMarker.setMap(map);

    map.panTo(position);

    setPlaceInfo({
      name: place.place_name,
      address: place.address_name,
      phone: place.phone,
      placeUrl: place.place_url,
    });
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="상호명 검색"
        style={{ padding: "8px", width: "300px", marginBottom: "10px" }}
      />

      {suggestions.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
          {suggestions.map((place) => (
            <li
              key={place.id}
              style={{
                padding: "5px",
                background: "#f0f0f0",
                cursor: "pointer",
                borderRadius: "4px",
                marginBottom: "5px",
              }}
              onClick={() => handleSuggestionClick(place)}
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}

      {placeInfo && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "300px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>장소 정보</h3>
          <p>
            <strong>장소 이름:</strong> {placeInfo.name}
          </p>
          <p>
            <strong>주소:</strong> {placeInfo.address}
          </p>
          <p>
            <strong>전화번호:</strong> {placeInfo.phone}
          </p>
          <p>
            <a
              href={placeInfo.placeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              더 보기
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default MapSearch;
