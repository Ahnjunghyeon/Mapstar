import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MapCategory from "./MapCategory";
import MapSearch from "./MapSearch";
import SearchHistory from "./SearchHistory";
import SelectedResult from "./SelectedResult";
import { debounce } from "lodash";
import "./Map.css";

const Map = ({ selectedRegion, user, isLoggedIn, userId }) => {
  const mapContainer = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const initialLevel = 5;

  useEffect(() => {
    const initialPosition = new window.kakao.maps.LatLng(37.5665, 126.978);

    const script = document.createElement("script");
    script.src =
      "https://dapi.kakao.com/v2/maps/sdk.js?appkey=dbcb1d68fd3c35a30fe94a2c6307b7ef&libraries=services,clusterer,drawing,geometry";
    script.onload = () => {
      if (window.kakao) {
        const container = mapContainer.current;
        const options = { center: initialPosition, level: initialLevel };
        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);
      } else {
        console.error("카카오 맵 API 로드 실패");
      }
    };
    script.onerror = () => {
      console.error("카카오 맵 API 로드 중 오류 발생");
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (selectedRegion && map) {
      const { lat, lng } = selectedRegion;
      const newPosition = new window.kakao.maps.LatLng(lat, lng);
      map.setCenter(newPosition);
    }
  }, [selectedRegion, map]);

  const handleSearchResults = (searchData) => {
    setSearchResults(searchData.results);
  };

  const debouncedSearchResults = debounce(async (term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/search?term=${term}`
      );
      handleSearchResults({
        results: response.data.results,
        searchTerm: term,
        userId,
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Search request failed:", error);
    }
  }, 300);

  const handleSearchTermChange = (term) => {
    debouncedSearchResults(term);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    const position = new window.kakao.maps.LatLng(item.y, item.x);

    if (marker) {
      marker.setMap(null);
    }

    const newMarker = new window.kakao.maps.Marker({ position, map });
    newMarker.setMap(map);
    map.panTo(position);
    setMarker(newMarker);
    setSearchResults([]);
  };

  const saveToHistory = async (place) => {
    if (!isLoggedIn) return;

    const history =
      JSON.parse(localStorage.getItem(`searchHistory_${userId}`)) || [];
    const newHistory = [
      { ...place, date: new Date().toISOString() },
      ...history,
    ];

    localStorage.setItem(
      `searchHistory_${userId}`,
      JSON.stringify(newHistory.slice(0, 10))
    );

    try {
      await axios.post("http://localhost:5000/api/search-history", {
        userId,
        searchTerm: place.place_name || place.address_name,
        time: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to save search history:", error);
    }
  };

  const resetMapPosition = () => {
    if (!map) return;

    const initialPosition = new window.kakao.maps.LatLng(37.5665, 126.978);
    map.setLevel(initialLevel);
    map.panTo(initialPosition);

    if (marker) {
      marker.setMap(null);
      setMarker(null);
    }

    setSearchResults([]);
    setSelectedItem(null);
  };

  const closeSelectedResult = () => {
    setSelectedItem(null);
  };

  return (
    <div className="map-container">
      <MapCategory map={map} />
      <MapSearch
        map={map}
        handleSearchResults={handleSearchResults}
        isLoggedIn={isLoggedIn}
        user={user}
        onSelect={handleSelectItem}
      />

      <SelectedResult
        selectedItem={selectedItem}
        isLoggedIn={isLoggedIn}
        closeSelectedResult={closeSelectedResult}
      />

      <button onClick={resetMapPosition} className="reset-button">
        <img src="/reset-icon.png" alt="Reset Map" className="reset-icon" />
      </button>

      <div ref={mapContainer} className="map"></div>
    </div>
  );
};

export default Map;
