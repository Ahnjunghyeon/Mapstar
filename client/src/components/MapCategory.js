import React, { useState, useRef, useEffect } from "react";
import "./MapCategory.css";

const MapCategory = ({ map }) => {
  const [categoryMarkers, setCategoryMarkers] = useState({});
  const [showMore, setShowMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const categoryRef = useRef(null);

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
        const updatedMarkers = { ...prev };
        delete updatedMarkers[category.name];
        return updatedMarkers;
      });
      return;
    }

    ps.categorySearch(
      category.code,
      (data, status) => {
        if (status !== window.kakao.maps.services.Status.OK) {
          console.warn(`${category.name} 검색 결과 없음`);
          return;
        }

        const bounds = map.getBounds();
        const newMarkers = data
          .filter((place) =>
            bounds.contain(new window.kakao.maps.LatLng(place.y, place.x))
          )
          .map((place) => {
            const position = new window.kakao.maps.LatLng(place.y, place.x);
            return new window.kakao.maps.Marker({
              position,
              map,
              image: new window.kakao.maps.MarkerImage(
                category.icon,
                new window.kakao.maps.Size(40, 40),
                { offset: new window.kakao.maps.Point(20, 40) }
              ),
            });
          });

        setCategoryMarkers((prev) => ({
          ...prev,
          [category.name]: newMarkers,
        }));
      },
      {
        location: map.getCenter(),
        bounds: map.getBounds(),
        radius: 20000,
        useStrictBounds: true,
      }
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`map-category-container ${isOpen ? "open" : ""}`}>
      <div className={`category-list ${showMore ? "open" : ""}`}>
        {categories
          .slice(0, showMore ? categories.length : 5)
          .map((category) => (
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
      <button
        className="toggle-button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "⇦" : "⇨"}
      </button>
    </div>
  );
};

export default MapCategory;
