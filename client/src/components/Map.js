import React, { useRef, useState, useEffect } from "react";
import MapCategory from "./MapCategory";
import MapSearch from "./MapSearch";
import SelectedResult from "./SelectedResult";
import "./Map.css";
import axios from "axios";

const initialPosition = new window.kakao.maps.LatLng(37.5665, 126.978);
const initialLevel = 5;
const markerImageUrl = "/userpin.png";

const Map = ({ selectedRegion, user, isLoggedIn }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=dbcb1d68fd3c35a30fe94a2c6307b7ef&libraries=services,clusterer,drawing,geometry";
    script.onload = () => {
      if (!window.kakao) return console.error("카카오 맵 API 로드 실패");

      const options = { center: initialPosition, level: initialLevel };
      const mapInstance = new window.kakao.maps.Map(
        mapContainer.current,
        options
      );

      const markerImage = new window.kakao.maps.MarkerImage(
        markerImageUrl,
        new window.kakao.maps.Size(40, 40),
        { alt: "기본 마커", offset: new window.kakao.maps.Point(20, 40) }
      );

      const initialMarker = new window.kakao.maps.Marker({
        position: initialPosition,
        image: markerImage,
      });
      initialMarker.setMap(mapInstance);

      setMap(mapInstance);
      setMarker(initialMarker);
    };
    script.onerror = () => console.error("카카오 맵 API 로드 중 오류 발생");

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (selectedRegion && map) {
      map.setCenter(
        new window.kakao.maps.LatLng(selectedRegion.lat, selectedRegion.lng)
      );
    }
  }, [selectedRegion, map]);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    const fetchSearchHistory = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/search-history?userId=${user.id}`
        );
        setSearchHistory(data);
      } catch (error) {
        console.error("검색 기록 로드 실패:", error);
      }
    };

    fetchSearchHistory();
  }, [isLoggedIn, user?.id]);

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    const position = new window.kakao.maps.LatLng(item.y, item.x);

    if (marker) marker.setMap(null);

    const newMarker = new window.kakao.maps.Marker({
      position,
      map,
      image: new window.kakao.maps.MarkerImage(
        markerImageUrl,
        new window.kakao.maps.Size(40, 40),
        { alt: "선택한 마커", offset: new window.kakao.maps.Point(20, 40) }
      ),
    });

    newMarker.setMap(map);
    map.panTo(position);
    setMarker(newMarker);
  };

  const resetMapPosition = () => {
    if (!map) return;

    map.setLevel(initialLevel);
    map.panTo(initialPosition);

    if (marker) marker.setMap(null);

    setSelectedItem(null);
  };

  // 화면 크기 변경에 따른 지도 크기 재조정
  useEffect(() => {
    const handleResize = () => {
      if (map) {
        map.relayout(); // 지도 크기 재조정
        map.setCenter(initialPosition); // 중심을 초기 위치로 설정
        map.setLevel(initialLevel); // 초기 레벨로 설정
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return (
    <div className="map-container">
      <MapCategory map={map} />

      <MapSearch
        map={map}
        isLoggedIn={isLoggedIn}
        user={user}
        onSelect={handleSelectItem}
        searchHistory={searchHistory}
      />

      <SelectedResult
        selectedItem={selectedItem}
        isLoggedIn={isLoggedIn}
        closeSelectedResult={() => setSelectedItem(null)}
      />
      <button onClick={resetMapPosition} className="reset-button">
        <img src="/reset-icon.png" alt="Reset Map" className="reset-icon" />
      </button>
      <div ref={mapContainer} className="map"></div>
    </div>
  );
};

export default Map;
