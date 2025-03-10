import React, { useState } from "react";
import "./MapCategory.css";

const MapCategory = ({ map }) => {
  const [categoryMarkers, setCategoryMarkers] = useState({});
  const [showMore, setShowMore] = useState(false);

  // 카카오톡 카테고리별 코드 ㅁ!
  const categoryCodes = {
    지하철역: "SW8",
    주차장: "PK6",
    대형마트: "MT1",
    편의점: "CS2",
    음식점: "FD6",
    병원: "HP8",
    약국: "PM9",
    카페: "CE7",
    학교: "SC4",
    학원: "AC5",
    "주유소, 충전소": "OL7",
    "어린이집, 유치원": "PS3",
    은행: "BK9",
    공공기관: "PO3",
    문화시설: "CT1",
    관광명소: "AT4",
    숙박: "AD5",
  };

  const categoryIcons = {
    지하철역: "/orangepin.png",
    주차장: "/blackpin.png",
    대형마트: "/orange.png",
    편의점: "/orangepin.png",
    음식점: "/redpin1.png",
    병원: "/pinkpin.png",
    약국: "/pinkpin.png",
    카페: "/greenpin.png",
    학교: "/blueyellowstarpin.png",
    학원: "/blueyellowstarpin.png",
    "주유소, 충전소": "/blackpin.png",
    "어린이집, 유치원": "/blueyellowstarpin.png",
    은행: "/bluepin.png",
    공공기관: "/bluepin.png",
    문화시설: "/bluepin.png",
    관광명소: "/bluepin.png",
    숙박: "/bluepin.png",
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
      ps.categorySearch(
        categoryCodes[category],
        (data, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const newMarkers = data.map((place) => {
              const position = new window.kakao.maps.LatLng(place.y, place.x);

              const markerImage = new window.kakao.maps.MarkerImage(
                categoryIcons[category] || "/icons/default.png",
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

            setCategoryMarkers((prev) => ({
              ...prev,
              [category]: newMarkers,
            }));
          }
        },
        {
          location: map.getCenter(),
          radius: 10000,
        }
      );
    }
  };

  return (
    <div className="map-category-container">
      {Object.keys(categoryCodes)
        .slice(0, 7)
        .map((category) => (
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
        Object.keys(categoryCodes)
          .slice(7)
          .map((category) => (
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
