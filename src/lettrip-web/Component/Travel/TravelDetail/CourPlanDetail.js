import React, { useEffect } from "react";

import "./PageDetail.css";

const CourseDetail = ({ course }) => {
  useEffect(() => {
    console.log(course);
  }, []);

  const getKoreanDateTime = (dateString) => {
    const options = {
      timeZone: "Asia/Seoul",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const koreanDate = new Date(dateString).toLocaleString("ko-KR", options);
    const [month, day, timePart] = koreanDate.split(". ");
    return `${month}/${day} ${timePart}`;
  };

  return (
    <div className='searchresult-container'>
      <div className='searchresult-header'>
        <div className='searchresult-title'>{course.place.name}</div>
      </div>
      <div className='searchresult-dayCountArrivedTime'>
        <div className='searchresult-dayCount'>예상 {course.dayCount}일차</div>
        <div className='searchresult-arrivedTime'>
          예상 {getKoreanDateTime(course.arrivedTime)}
        </div>
      </div>
      <div className='searchresult-cost'>예상 {course.cost}원</div>
    </div>
  );
};

export default CourseDetail;
