import React from "react";
import "./TravelList.css";
import { useNavigate } from "react-router-dom";

function TravelList() {
  const navigate = useNavigate();
  function handleCreateCourse() {
    navigate("/Travel/create/course");
  }
  function handleCreateReview() {
    navigate("/Travel/create/review");
  }

  return (
    <div className='create-buttons-container'>
      <button onClick={handleCreateCourse} className='course-button'>
        여행 코스 등록
      </button>
      <button onClick={handleCreateReview} className='review-button'>
        여행 코스 후기 등록
      </button>
    </div>
  );
}

export default TravelList;
