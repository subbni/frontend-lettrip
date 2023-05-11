import axios from "axios";
import React, { useState } from "react";
import "./ReviewForm.css";

function ReviewForm({ onSave }) {
  const [files, setFiles] = useState([]);
  const [arrivalTime, setArrivalTime] = useState("");
  const [cost, setCost] = useState("");
  const [review, setReview] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!arrivalTime.trim()) {
      alert("도착 시간을 입력해주세요");
      return;
    }
    if (!cost.trim()) {
      alert("비용을 입력해주세요");
      return;
    }
    if (!review.trim()) {
      alert("코스 후기를 입력해주세요");
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files[]", files[i]);
    }
    formData.append("arrival_time", arrivalTime);
    formData.append("cost", cost);
    formData.append("review", review);

    axios
      .post("/api/reviews", formData)
      .then((response) => {
        console.log(response.data);
        setFiles([]);
        setArrivalTime("");
        setCost("");
        setReview("");
        onSave(formData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className='CreateContent'>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='files'>사진</label>
          <input
            type='file'
            id='files'
            multiple
            onChange={(event) => setFiles(event.target.files)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='arrivalTime'>도착 시간</label>
          <input
            type='time'
            id='arrivalTime'
            value={arrivalTime}
            onChange={(event) => setArrivalTime(event.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='cost'>비용</label>
          <input
            type='text'
            id='cost'
            value={cost}
            onChange={(event) => setCost(event.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='review'>코스 후기</label>
          <textarea
            id='review'
            value={review}
            onChange={(event) => setReview(event.target.value)}
          />
        </div>
        <button type='submit'>제출</button>
      </form>
    </div>
  );
}

export default ReviewForm;
