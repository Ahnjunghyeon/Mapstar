import React, { useState, useEffect } from "react";

const MapCategory = ({ map }) => {
  const categoryCodes = {
    대형마트: "MT1",
    편의점: "CS2",
    "어린이집, 유치원": "PS3",
    학교: "SC4",
    학원: "AC5",
    주차장: "PK6",
    "주유소, 충전소": "OL7",
    지하철역: "SW8",
    은행: "BK9",
    문화시설: "CT1",
    중개업소: "AG2",
    공공기관: "PO3",
    관광명소: "AT4",
    숙박: "AD5",
    음식점: "FD6",
    카페: "CE7",
    병원: "HP8",
    약국: "PM9",
  };

  //카테고리 이미지 추가하기
  const categoryColors = {
    대형마트: "/bluecorn.png", // ✅ 이렇게 public 기준 경로/ 절대경로 사용해야함.
    편의점:
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 카카오톡 마커
    음식점: "https://example.com/blue-marker.png",
    카페: "https://example.com/yellow-marker.png",
    병원: "https://example.com/purple-marker.png",
    약국: "https://example.com/orange-marker.png",
  };

  const [categoryMarkers, setCategoryMarkers] = useState({}); // 카테고리별 마커 저장용
  const defaultMarkerImage = "/markers/default-marker.png"; // 기본값

  const toggleCategory = (category) => {
    if (!map) return;

    const ps = new window.kakao.maps.services.Places();

    // 마커 있을때 제거
    if (categoryMarkers[category]) {
      categoryMarkers[category].forEach((marker) => marker.setMap(null));
      setCategoryMarkers((prev) => {
        const newMarkers = { ...prev };
        delete newMarkers[category];
        return newMarkers;
      });
    } else {
      // 마커 없을때 추가
      ps.categorySearch(
        categoryCodes[category],
        (data, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const newMarkers = data.map((place) => {
              const position = new window.kakao.maps.LatLng(place.y, place.x);
              const marker = new window.kakao.maps.Marker({
                position,
                map,
                image: new window.kakao.maps.MarkerImage(
                  categoryColors[category] || defaultMarkerImage, // 없는 경우 기본 이미지
                  new window.kakao.maps.Size(24, 35)
                ),
              });

              return marker;
            });

            setCategoryMarkers((prev) => ({
              ...prev,
              [category]: newMarkers,
            }));
          }
        },
        {
          bounds: map.getBounds(), // 화면 전체 범위에서 검색
        }
      );
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {Object.keys(categoryCodes).map((category) => (
        <button
          key={category}
          onClick={() => toggleCategory(category)}
          style={{
            margin: "5px",
            padding: "8px 12px",
            backgroundColor: categoryMarkers[category] ? "#ffdd57" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default MapCategory;
