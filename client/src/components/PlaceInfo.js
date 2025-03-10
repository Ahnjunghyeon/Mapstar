import React from "react";

const PlaceInfo = ({ placeInfo }) => {
  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "300px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h3>{placeInfo.name}</h3>
      <p>
        <strong>주소:</strong> {placeInfo.address}
      </p>
      {placeInfo.phone && (
        <p>
          <strong>전화번호:</strong> {placeInfo.phone}
        </p>
      )}
      {placeInfo.placeUrl && (
        <p>
          <a
            href={placeInfo.placeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            더 보기
          </a>
        </p>
      )}
    </div>
  );
};

export default PlaceInfo;
