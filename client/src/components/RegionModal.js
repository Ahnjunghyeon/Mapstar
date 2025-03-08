import React from "react";

const RegionModal = ({ setSelectedRegion, closeModal }) => {
  const regions = [
    { name: "강원특별자치도", lat: 37.8853, lng: 127.7298 },
    { name: "경기도", lat: 37.3036, lng: 127.0463 },
    { name: "서울특별시", lat: 37.5665, lng: 126.978 },
    { name: "부산광역시", lat: 35.1796, lng: 129.0756 },
    { name: "대구광역시", lat: 35.8703, lng: 128.591 },
    { name: "인천광역시", lat: 37.4563, lng: 126.7052 },
    { name: "광주광역시", lat: 35.1604, lng: 126.8526 },
    { name: "대전광역시", lat: 36.3504, lng: 127.3845 },
    { name: "울산광역시", lat: 35.5384, lng: 129.3116 },
    { name: "세종특별자치시", lat: 36.4801, lng: 127.2896 },
    { name: "제주특별자치도", lat: 33.4996, lng: 126.5312 },
  ];

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    closeModal();
  };
  const SelectModalClose = () => {
    closeModal();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          width: "300px",
          textAlign: "center",
        }}
      >
        <h2>지역 선택</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {regions.map((region) => (
            <button
              key={region.name}
              onClick={() => handleSelectRegion(region)} // 클릭 시 지역 이동 및 모달 닫기
              style={{
                padding: "10px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {region.name}
            </button>
          ))}
          <button onClick={() => SelectModalClose()}> 닫기</button>
        </div>
      </div>
    </div>
  );
};

export default RegionModal;
