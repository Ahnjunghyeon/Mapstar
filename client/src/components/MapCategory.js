import React, { useState } from "react";
import "./MapCategory.css";
import StoreSearch from "./StoreSearch";

const MapCategory = ({ map }) => {
  const [categoryMarkers, setCategoryMarkers] = useState({});
  const [showMore, setShowMore] = useState(false);

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
              const marker = new window.kakao.maps.Marker({
                position,
                map,
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
      <StoreSearch map={map} />
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
