import React, { useState, useEffect } from "react";

const AddressSearch = ({ map, marker, setMarker }) => {
  const [address, setAddress] = useState("");
  const [placeInfo, setPlaceInfo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = () => {
    if (!address) return;

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const lat = result[0].y;
        const lng = result[0].x;
        const position = new window.kakao.maps.LatLng(lat, lng);

        if (marker) {
          marker.setMap(null);
        }

        const newMarker = new window.kakao.maps.Marker({
          position: position,
        });

        newMarker.setMap(map);
        map.setCenter(position);
        map.setLevel(3);

        setMarker(newMarker);

        setPlaceInfo({
          name: result[0].address_name,
          lat: lat,
          lng: lng,
        });
      } else {
        alert("주소를 찾을 수 없습니다.");
      }
    });
  };

  useEffect(() => {
    if (!address) {
      setSuggestions([]);
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSuggestions(result);
      } else {
        setSuggestions([]);
      }
    });
  }, [address]);

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.address_name);
    setSuggestions([]);

    const lat = suggestion.y;
    const lng = suggestion.x;
    const position = new window.kakao.maps.LatLng(lat, lng);

    if (marker) {
      marker.setMap(null);
    }

    const newMarker = new window.kakao.maps.Marker({
      position: position,
    });

    newMarker.setMap(map);
    map.setCenter(position);
    map.setLevel(3);

    setMarker(newMarker);

    setPlaceInfo({
      name: suggestion.address_name,
      lat: lat,
      lng: lng,
    });
  };

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="주소 검색"
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "250px",
          marginRight: "10px",
        }}
      />
      <button onClick={handleSearch} style={{ padding: "10px 20px" }}>
        검색
      </button>

      {suggestions.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: "5px",
                background: "#f0f0f0",
                cursor: "pointer",
                borderRadius: "4px",
                marginBottom: "5px",
              }}
            >
              {suggestion.address_name}
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
          <h3>검색된 주소</h3>
          <p>
            <strong>주소:</strong> {placeInfo.name}
          </p>
          <p>
            <strong>위도:</strong> {placeInfo.lat}
          </p>
          <p>
            <strong>경도:</strong> {placeInfo.lng}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressSearch;
