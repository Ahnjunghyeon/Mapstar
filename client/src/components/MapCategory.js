import React, { useState } from "react";
import "./MapCategory.css";

const MapCategory = ({ map }) => {
  const [categoryMarkers, setCategoryMarkers] = useState({});
  const [showMore, setShowMore] = useState(false);

  const categories = [
    { name: "지하철역", code: "SW8", icon: "/subway.png" },
    { name: "편의점", code: "CS2", icon: "/Conveniencestore.png" },
    { name: "음식점", code: "FD6", icon: "/Restaurant.png" },
    { name: "병원", code: "HP8", icon: "/Hospital.png" },
    { name: "주차장", code: "PK6", icon: "/Parking.png" },
    { name: "약국", code: "PM9", icon: "/Drugstore1.png" },
    { name: "카페", code: "CE7", icon: "/Cafe.png" },
    { name: "학교", code: "SC4", icon: "/School.png" },
    { name: "주유소, 충전소", code: "OL7", icon: "/Charge.png" },
    { name: "공공기관", code: "PO3", icon: "/Public.png" },
    { name: "대형마트", code: "MT1", icon: "/Shopping.png" },
  ];

  const toggleCategory = (category) => {
    if (!map) return;

    const ps = new window.kakao.maps.services.Places();
    const existingMarkers = categoryMarkers[category.name];

    if (existingMarkers) {
      existingMarkers.forEach((marker) => marker.setMap(null));
      setCategoryMarkers((prev) => {
        const newMarkers = { ...prev };
        delete newMarkers[category.name];
        return newMarkers;
      });
    } else {
      const bounds = map.getBounds();
      const center = map.getCenter();

      ps.categorySearch(
        category.code,
        (data, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const newMarkers = data
              .filter((place) => {
                const position = new window.kakao.maps.LatLng(place.y, place.x);
                return bounds.contain(position);
              })
              .map((place) => {
                const position = new window.kakao.maps.LatLng(place.y, place.x);
                const markerImage = new window.kakao.maps.MarkerImage(
                  category.icon,
                  new window.kakao.maps.Size(40, 40),
                  { offset: new window.kakao.maps.Point(20, 40) }
                );
                return new window.kakao.maps.Marker({
                  position,
                  map,
                  image: markerImage,
                });
              });

            setCategoryMarkers((prev) => ({
              ...prev,
              [category.name]: newMarkers,
            }));
          } else {
            console.warn(`${category.name} 검색 결과 없음`);
          }
        },
        {
          location: center,
          bounds: bounds,
          radius: 20000, // 20km 범위
          useStrictBounds: true,
        }
      );
    }
  };

  return (
    <div className={`map-category-container ${showMore ? "show-more" : ""}`}>
      {categories.slice(0, 5).map((category) => (
        <button
          key={category.name}
          onClick={() => toggleCategory(category)}
          className={`category-button ${
            categoryMarkers[category.name] ? "active" : ""
          }`}
        >
          {category.name}
        </button>
      ))}

      {showMore &&
        categories.slice(5).map((category) => (
          <button
            key={category.name}
            onClick={() => toggleCategory(category)}
            className={`category-button ${
              categoryMarkers[category.name] ? "active" : ""
            }`}
          >
            {category.name}
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
