import React, { useState } from "react";

const AddressSearch = ({ map, marker, setMarker }) => {
  const [address, setAddress] = useState("");

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
        map.panTo(position);

        setMarker(newMarker);
      } else {
        alert("주소를 찾을 수 없습니다.");
      }
    });
  };

  return (
    <div style={{ marginBottom: "20px" }}>
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
    </div>
  );
};

export default AddressSearch;
