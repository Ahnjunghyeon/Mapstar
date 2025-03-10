import React, { useState, useEffect } from "react";

const StoreSearch = ({ map }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [placeInfo, setPlaceInfo] = useState(null);

  useEffect(() => {
    if (!map || searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(
      searchQuery,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSuggestions(data.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      },
      {
        location: map.getCenter(),
        radius: 10000,
      }
    );
  }, [searchQuery, map]);

  const handleSearch = () => {
    if (!map || !searchQuery.trim()) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(
      searchQuery,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          markers.forEach((marker) => marker.setMap(null));

          const newMarkers = data.map((place) => {
            const position = new window.kakao.maps.LatLng(place.y, place.x);
            const marker = new window.kakao.maps.Marker({
              position,
              map,
            });

            window.kakao.maps.event.addListener(marker, "click", () => {
              setPlaceInfo({
                name: place.place_name,
                address: place.address_name,
                phone: place.phone,
                placeUrl: place.place_url,
              });
              map.setCenter(position);
            });

            return marker;
          });

          setMarkers(newMarkers);
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      },
      {
        location: map.getCenter(),
        radius: 10000,
      }
    );
  };

  const selectPlace = (place) => {
    setPlaceInfo({
      name: place.place_name,
      address: place.address_name,
      phone: place.phone,
      placeUrl: place.place_url,
    });

    const position = new window.kakao.maps.LatLng(place.y, place.x);
    map.setCenter(position);

    markers.forEach((marker) => marker.setMap(null));

    const marker = new window.kakao.maps.Marker({
      position,
      map,
    });
    setMarkers([marker]);

    setSearchQuery(place.place_name);
    setSuggestions([]);
  };

  return (
    <div className="store-search-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="가게 이름을 검색하세요"
      />
      <button onClick={handleSearch}>검색</button>

      {suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((place) => (
            <li key={place.id} onClick={() => selectPlace(place)}>
              {place.place_name}
            </li>
          ))}
        </ul>
      )}

      <ul className="search-results">
        {searchResults.map((place) => (
          <li key={place.id} onClick={() => selectPlace(place)}>
            {place.place_name}
          </li>
        ))}
      </ul>

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

export default StoreSearch;
