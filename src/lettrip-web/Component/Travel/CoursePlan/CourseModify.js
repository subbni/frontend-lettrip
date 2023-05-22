import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CourseForm from "./CourseForm";

const instance = axios.create({
  baseURL: "http://192.168.25.19/api",
});

function CourseModify() {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [contentsData, setContentsData] = useState([]);
  const [isAddContentClicked, setIsAddContentClicked] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      const response = await instance.get(`/travel_courses/${id}`);
      const { title, start_date, end_date, contents } = response.data;
      setTitle(title);
      setStartDate(start_date);
      setEndDate(end_date);
      setContentsData(contents);
    }
    fetchData();
  }, [id]);

  const handleStartDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      alert("출발 날짜는 현재 날짜 이후로 선택해주세요.");
      return;
    }
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const startDateObject = new Date(startDate);

    if (selectedDate < startDateObject) {
      alert("도착 날짜는 출발 날짜 이후로 선택해주세요.");
      return;
    }

    const diffInDays = Math.ceil(
      Math.abs(selectedDate - startDateObject) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays > 10) {
      alert("최대 10일까지 선택 가능합니다.");
      return;
    }

    setEndDate(event.target.value);
  };

  const handleAddContentClick = () => {
    setIsAddContentClicked(true);
  };
  const handleContentDelete = (index) => {
    const newContents = [...contentsData];
    newContents.splice(index, 1);
    setContentsData(newContents);
  };
  const handleContentSave = (index, contentData, isNew) => {
    const newContents = [...contentsData];

    if (isNew) {
      newContents.push(contentData);
    } else {
      newContents[index] = contentData;
    }

    setContentsData(newContents);
    setIsAddContentClicked(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요");
      return;
    }
    if (!startDate.trim() || !endDate.trim()) {
      alert("여행 일자를 입력해주세요");
      return;
    }
    const confirmResult = window.confirm("여행 코스 계획을 수정하시겠습니까?");
    if (!confirmResult) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("contents", JSON.stringify(contentsData));

    const response = await instance.post("/travel_courses", formData);

    alert("여행 코스 계획이 등록되었습니다.");
    navigate(`/TravelCourse/${response.data.travel_review.id}`);
  };

  return (
    <div className='travel-course-create-container'>
      <h1>여행 코스 계획 작성</h1>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>제목</label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='startDate'>출발 날짜</label>
          <input
            type='date'
            id='startDate'
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='endDate'>도착 날짜</label>
          <input
            type='date'
            id='endDate'
            value={endDate}
            onChange={handleEndDateChange}
          />
        </div>
        {contentsData.map((blockData, index) => (
          <CourseForm
            key={index}
            blockData={blockData}
            index={index}
            onDelete={handleContentDelete}
            onSave={handleContentSave}
          />
        ))}

        {isAddContentClicked ? (
          <CourseForm
            onSave={handleContentSave}
            onCancel={() => setIsAddContentClicked(false)}
          />
        ) : (
          <button type='button' onClick={handleAddContentClick}>
            본문 추가하기
          </button>
        )}
        <button type='submit'>등록</button>
      </form>
    </div>
  );
}

export default CourseModify;
