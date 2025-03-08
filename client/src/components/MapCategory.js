import React, { useState } from "react";
import "./MapCategory.css";

const MapCategory = ({ map }) => {
  const [categoryMarkers, setCategoryMarkers] = useState({});
  const [placeInfo, setPlaceInfo] = useState(null);

  const categoryCodes = {
    대형마트: "MT1",
    편의점: "CS2",
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
          console.log("검색된 장소 데이터:", data);
          console.log("검색 상태:", status);

          if (status === window.kakao.maps.services.Status.OK) {
            const newMarkers = data.map((place) => {
              const position = new window.kakao.maps.LatLng(place.y, place.x);
              const marker = new window.kakao.maps.Marker({
                position,
                map,
                image: new window.kakao.maps.MarkerImage(
                  categoryColors[category] || "/default-marker.png",
                  new window.kakao.maps.Size(24, 35)
                ),
              });

              window.kakao.maps.event.addListener(marker, "click", () => {
                setPlaceInfo({
                  name: place.place_name,
                  address: place.address_name,
                  phone: place.phone,
                  placeUrl: place.place_url,
                });
              });

              return marker;
            });

            setCategoryMarkers((prev) => ({
              ...prev,
              [category]: newMarkers,
            }));
          } else {
            console.log("검색 실패: ", status);
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
      {Object.keys(categoryCodes).map((category) => (
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

      {placeInfo && (
        <div className="place-info">
          <h3>장소 정보</h3>
          <p>
            <strong>장소 이름:</strong> {placeInfo.name}
          </p>
          <p>
            <strong>주소:</strong> {placeInfo.address}
          </p>
          <p>
            <strong>전화번호:</strong> {placeInfo.phone}
          </p>
          <p>
            <a
              href={placeInfo.placeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              더 보기
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default MapCategory;
