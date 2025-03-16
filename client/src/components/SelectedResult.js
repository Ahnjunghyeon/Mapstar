import React from "react";
import "./SelectedResult.css";

const SelectedResult = ({ selectedItem, closeSelectedResult }) => {
  if (!selectedItem) return null;

  return (
    <div className="selected-result-container">
      <div className="selected-result-card">
        <h3 className="selected-result-title">선택된 장소</h3>
        <p>
          <strong>상호명:</strong>{" "}
          {selectedItem.place_name || selectedItem.address_name}
        </p>
        <p>
          <strong>주소:</strong> {selectedItem.address_name}
        </p>
        {selectedItem.phone && (
          <p>
            <strong>전화번호:</strong> {selectedItem.phone}
          </p>
        )}
        {selectedItem.place_url && (
          <p>
            <strong>상세 정보:</strong>{" "}
            <a
              href={selectedItem.place_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              카카오맵에서 보기
            </a>
          </p>
        )}
        <button onClick={closeSelectedResult} className="close-button">
          닫기
        </button>
      </div>
    </div>
  );
};

export default SelectedResult;
