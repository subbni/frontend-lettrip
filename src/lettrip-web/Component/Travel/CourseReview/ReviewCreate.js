import React, { useState, useEffect } from "react";
import "./ReviewCreate.css";
import { CreateReview } from "../../../Service/AuthService";

function ReviewCreate() {
  const [TravelForm, setTravelForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    province: "",
    city: "",
    totalCost: "",
    theme: "",
    numberOfCourses: "",
  });

  const handleTravelFormChange = (e) => {
    const changedField = e.target.name;
    let newValue = e.target.value;
    setTravelForm({
      ...TravelForm,
      [changedField]: newValue,
    });
  };

  const handleTravelFormSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("여행 코스 후기를 등록하시겠습니까?")) {
      CreateReview(TravelForm)
        .then((response) => {
          if (response.success) {
            window.alert("여행 코스 후기 작성이 완료되었습니다.");
          } else {
            console.log(response);
            window.alert(`실패 원인: ${response.message}`);
          }
        })
        .catch((e) => {
          window.alert(
            "여행 코스 후기 작성에 실패했습니다. 다시 시도해주시길 바랍니다."
          );
          console.log(e);
        });
    }
  };

  return (
    <div className="Travel_review_container">
      <h1 className="Travel_course_text">여행 코스 후기 작성</h1>
      <form onSubmit={handleTravelFormSubmit}>
        <div className="Travel_review_title">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            required
            value={TravelForm.title}
            onChange={handleTravelFormChange}
          />
        </div>
        <div className="Travel_review_theme">
          <label htmlFor="theme">테마</label>
          <select
            name="theme"
            id="theme"
            required
            defaultValue="default"
            onChange={handleTravelFormChange}
          >
            <option value="default" disabled>
              테마 선택
            </option>
          </select>
        </div>
        <div className="Travel_review_startDate">
          <label htmlFor="startDate">출발 날짜</label>
          <input
            type="date"
            id="startDate"
            required
            value={TravelForm.startDate}
            onChange={handleTravelFormChange}
          />
        </div>
        <div className="Travel_review_endDate">
          <label htmlFor="endDate">도착 날짜</label>
          <input
            type="date"
            id="endDate"
            required
            value={TravelForm.endDate}
            onChange={handleTravelFormChange}
          />
        </div>
        <div className="Travel_review_province_city">
          <label htmlFor="province">행정구역</label>
          <select
            name="text"
            id="province"
            required
            value={TravelForm.title}
            defaultValue="default"
            onChange={handleTravelFormChange}
          >
            <option value="default" disabled>
              시도 선택
            </option>
          </select>
          <label htmlFor="city">지역</label>
          <select
            name="city"
            id="city"
            value={TravelForm.city}
            defaultValue="default"
            onChange={handleTravelFormChange}
          >
            <option value="default" disabled>
              지역 선택
            </option>
          </select>
        </div>
        <div>코스 수 : {TravelForm.numberOfCourses}</div>
        <div>총 비용: {TravelForm.totalCost}</div>

        <button type="submit">등록</button>
      </form>
    </div>
  );
}

// export default ReviewCreate;
