import React, { useState } from "react";
import axios from "axios";
import "./CourseForm.css";
import CoursePlaceForm from "./CoursePlaceForm";

function CourseForm({ onSave }) {
  const [arrivalTime, setArrivalTime] = useState("");
  const [cost, setCost] = useState("");
  const [place, setPlace] = useState("");
  const [isPlaceFormOpen, setIsPlaceFormOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!place.trim()) {
      alert("방문할 장소를 입력해주세요");
      return;
    }
    if (!arrivalTime.trim()) {
      alert("예상 도착 시간을 입력해주세요");
      return;
    }
    if (!cost.trim()) {
      alert("예상 비용을 입력해주세요");
      return;
    }
    const formData = new FormData();
    formData.append("arrival_time", arrivalTime);
    formData.append("cost", cost);
    formData.append("place", place);
    axios
      .post("/api/course", formData)
      .then((response) => {
        console.log(response.data);
        setArrivalTime("");
        setCost("");
        onSave(formData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePlaceFormOpen = () => {
    setIsPlaceFormOpen(true);
  };

  const handlePlaceFormClose = () => {
    setIsPlaceFormOpen(false);
  };

  const handlePlaceSave = (savedPlace) => {
    setPlace(savedPlace.place_name);
    setIsPlaceFormOpen(false);
  };

  return (
    <div className='CreateContent'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='place'>장소</label>
          <input
            type='text'
            id='place'
            value={place}
            onChange={(event) => setPlace(event.target.value)}
          />
          <button type='button' onClick={handlePlaceFormOpen}>
            입력하기
          </button>
        </div>
        {isPlaceFormOpen && (
          <div className='Modal'>
            <div className='ModalContent'>
              <CoursePlaceForm onSave={handlePlaceSave} />
              <button onClick={handlePlaceFormClose}>닫기</button>
            </div>
          </div>
        )}
        <div className='form-group'>
          <label htmlFor='arrivalTime'>예상 도착 시간</label>
          <input
            type='time'
            id='arrivalTime'
            value={arrivalTime}
            onChange={(event) => setArrivalTime(event.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='cost'>예상 비용</label>
          <input
            type='text'
            id='cost'
            value={cost}
            onChange={(event) => setCost(event.target.value)}
          />
        </div>
        <button type='submit'>제출</button>
      </form>
    </div>
  );
}

export default CourseForm;
