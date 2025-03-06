import React, { useRef, useState, useEffect } from "react";
import MapCategory from "./MapCategory";

const Map = () => {
  const mapContainer = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const container = mapContainer.current;
    const options = {
      center: new window.kakao.maps.LatLng(37.3434, 127.9204),
      level: 5,
    };

    const mapInstance = new window.kakao.maps.Map(container, options);
    setMap(mapInstance);
  }, []);

  const handleSearch = () => {
    if (!searchTerm) return;

    const places = new window.kakao.maps.services.Places();

    places.keywordSearch(searchTerm, (results, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const lat = results[0].y;
        const lng = results[0].x;

        const position = new window.kakao.maps.LatLng(lat, lng);

        if (marker) {
          marker.setMap(null);
        }

        const newMarker = new window.kakao.maps.Marker({
          position: position,
        });

        newMarker.setMap(map);
        setMarker(newMarker);

        map.panTo(position);
      } else {
        alert("해당 상호명을 찾을 수 없습니다.");
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="가게 검색"
      />
      <button onClick={handleSearch}>검색</button>
      <MapCategory map={map} />

      <div ref={mapContainer} style={{ width: "100%", height: "600px" }}>
        {" "}
      </div>
    </div>
  );
};

export default Map;
