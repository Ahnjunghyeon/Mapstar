import React, { useState } from "react";
import "./MapCategory.css";

const MapCategory = ({ map }) => {
  const [categoryMarkers, setCategoryMarkers] = useState({});
  const [showMore, setShowMore] = useState(false);

  const primaryCategories = ["지하철역", "편의점", "음식점", "주차장", "병원"];
  const additionalCategories = [
    "약국",
    "카페",
    "학교",
    "주유소, 충전소",
    "공공기관",
    "대형마트",
  ];

  const categoryCodes = {
    지하철역: "SW8",
    편의점: "CS2",
    음식점: "FD6",
    병원: "HP8",
    주차장: "PK6",
    약국: "PM9",
    카페: "CE7",
    학교: "SC4",
    "주유소, 충전소": "OL7",
    공공기관: "PO3",
    대형마트: "MT1",
  };

  const categoryIcons = {
    지하철역: "/subway.png",
    편의점: "/Conveniencestore.png",
    음식점: "/Restaurant.png",
    병원: "/Hospital.png",
    주차장: "/Parking.png",
    약국: "/Drugstore.png",
    카페: "/Cafe.png",
    학교: "/School.png",
    "주유소, 충전소": "/Charge.png",
    공공기관: "/Public.png",
    대형마트: "/Shopping.png",
  };

  const toggleCategory = (category) => {
    if (!map) return;

    const ps = new window.kakao.maps.services.Places();

    if (categoryMarkers[category]) {
      categoryMarkers[category].forEach((marker) => marker.setMap(null));
      setCategoryMarkers((prev) => {
        const newMarkers = { ...prev };
        delete newMarkers[category];
        return newMarkers;
      });
    } else {
      const bounds = map.getBounds();
      const center = map.getCenter();

      ps.categorySearch(
        categoryCodes[category],
        (data, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            console.log(`${category} 검색 결과 개수:`, data.length);

            // 검색 결과 -> 마커 생성
            const newMarkers = data.map((place) => {
              const position = new window.kakao.maps.LatLng(place.y, place.x);

              const markerImage = new window.kakao.maps.MarkerImage(
                categoryIcons[category] || "/purplecorn.png",
                new window.kakao.maps.Size(40, 40),
                { offset: new window.kakao.maps.Point(20, 40) }
              );

              const marker = new window.kakao.maps.Marker({
                position,
                map,
                image: markerImage,
              });

              return marker;
            });

            // 생성된 마커들을 categoryMarkers 상태에 저장
            setCategoryMarkers((prev) => ({
              ...prev,
              [category]: newMarkers,
            }));
          } else {
            console.warn(`${category} 검색 결과 없음`);
          }
        },
        {
          location: center,
          bounds: bounds,
          radius: 20000, // 검색 범위 (20km)
          useStrictBounds: true,
        }
      );
    }
  };

  return (
    <div className={`map-category-container ${showMore ? "show-more" : ""}`}>
      {primaryCategories.map((category) => (
        <button
          key={category}
          onClick={() => toggleCategory(category)}
          className={`category-button ${
            categoryMarkers[category] ? "active" : ""
          }`}
        >
          {category}
        </button>
      ))}

      {showMore &&
        additionalCategories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            className={`category-button ${
              categoryMarkers[category] ? "active" : ""
            }`}
          >
            {category}
          </button>
        ))}

      <button
        onClick={() => setShowMore(!showMore)}
        className="category-button more-button"
      >
        {showMore ? "－" : "＋"}
      </button>
    </div>
  );
};

export default MapCategory;
