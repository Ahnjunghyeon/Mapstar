import React, { useRef, useState, useEffect } from "react";
import MapCategory from "./MapCategory";
import AddressSearch from "./AddressSearch"; // 주소 검색 컴포넌트 추가

const Map = () => {
  const mapContainer = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const initialPosition = new window.kakao.maps.LatLng(37.3434, 127.9204);
  const initialLevel = 5;

  // 카카오 맵 API 로드 및 맵 초기화
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=dbcb1d68fd3c35a30fe94a2c6307b7ef&libraries=services,clusterer,drawing,geometry";
    script.onload = () => {
      const container = mapContainer.current;
      const options = {
        center: initialPosition,
        level: initialLevel,
      };

      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);
    };
    document.head.appendChild(script);
  }, []); // 빈 배열로 설정하여 최초 1회만 실행되도록

  const handleSearch = () => {
    if (!searchTerm) return;

    const places = new window.kakao.maps.services.Places();

    places.keywordSearch(searchTerm, (results, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const lat = results[0].y;
        const lng = results[0].x;

        const position = new window.kakao.maps.LatLng(lat, lng);

        if (marker) {
          marker.setMap(null);
        }

        const newMarker = new window.kakao.maps.Marker({
          position: position,
        });

        newMarker.setMap(map);
        setMarker(newMarker);

        map.panTo(position);
      } else {
        alert("해당 상호명을 찾을 수 없습니다.");
      }
    });
  };

  // 지도 리셋
  const resetMapPosition = () => {
    if (!map) return;
    map.setLevel(initialLevel);
    map.panTo(initialPosition);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="가게 검색"
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            width: "80%",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          검색
        </button>
      </div>

      <MapCategory map={map} />
      {/* 주소 검색 컴포넌트 추가 */}
      <AddressSearch map={map} setMarker={setMarker} />
      <button
        onClick={resetMapPosition}
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          zIndex: 10,
          fontSize: "18px",
        }}
      >
        ⟳
      </button>

      <div
        ref={mapContainer}
        style={{ width: "100%", height: "600px", marginTop: "10px" }}
      ></div>
    </div>
  );
};

export default Map;
