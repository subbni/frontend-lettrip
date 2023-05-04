import React from "react";
import "./TravelList.css";
import { useNavigate } from "react-router-dom";

function TravelCreate() {
  const navigate = useNavigate();
  function handleCreateCourse() {
    navigate("/Travel/create/course");
  }
  function handleCreateReview() {
    navigate("/Travel/create/review");
  }

  return (
    <div>
      <button onClick={handleCreateCourse} className='create-button'>
        여행 코스 등록
      </button>
      <button onClick={handleCreateReview} className='create-button'>
        여행 코스 후기 등록
      </button>
    </div>
  );
}

export default TravelCreate;
