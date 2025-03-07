import React, { useState } from "react";

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
    공공기관: "PO3",
    관광명소: "AT4",
    숙박: "AD5",
    음식점: "FD6",
    카페: "CE7",
    병원: "HP8",
    약국: "PM9",
  };

  const categoryColors = {
    대형마트: "/bluecorn.png",
    편의점:
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
    음식점: "https://example.com/blue-marker.png",
    카페: "https://example.com/yellow-marker.png",
    병원: "https://example.com/purple-marker.png",
    약국: "https://example.com/orange-marker.png",
  };

  const [categoryData, setCategoryData] = useState({});

  const defaultMarkerImage = "/markers/default-marker.png";

  const toggleCategory = (category) => {
    if (!map) return;

    const ps = new window.kakao.maps.services.Places();

    if (categoryData[category]) {
      categoryData[category].markers.forEach((marker) => marker.setMap(null));
      categoryData[category].clusterer.clear();

      setCategoryData((prev) => {
        const newData = { ...prev };
        delete newData[category];
        return newData;
      });
    } else {
      ps.categorySearch(
        categoryCodes[category],
        (data, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const newMarkers = data.map((place) => {
              const position = new window.kakao.maps.LatLng(place.y, place.x);
              return new window.kakao.maps.Marker({
                position,
                image: new window.kakao.maps.MarkerImage(
                  categoryColors[category] || defaultMarkerImage,
                  new window.kakao.maps.Size(24, 35)
                ),
              });
            });

            const clusterer = new window.kakao.maps.MarkerClusterer({
              map,
              averageCenter: true,
              minLevel: 10,
            });
            clusterer.addMarkers(newMarkers);

            setCategoryData((prev) => ({
              ...prev,
              [category]: { markers: newMarkers, clusterer },
            }));
          }
        },
        {
          bounds: map.getBounds(),
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
            backgroundColor: categoryData[category] ? "#ffdd57" : "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            transition: "background-color 0.3s",
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default MapCategory;
