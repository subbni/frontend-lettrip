import React, { useEffect, useState } from "react";
import "./Plan.css";
import MapForm from "./MapForm";
import CourseItem from "./CourseItem";

const CourseContainer = ({ onCourseInsert, dayCount, containerIdx }) => {
  const [courseList, setCourseList] = useState([]);
  const [isSearchClickedList, setIsSearchClickedList] = useState([]);

  const handleAddCourse = (e) => {
    e.preventDefault();
    setCourseList([...courseList, {}]);
    setIsSearchClickedList([...isSearchClickedList, false]);
  };

  const handleSearchBtnClick = (index, e) => {
    e.preventDefault();
    setIsSearchClickedList((prevList) => {
      const updatedList = [...prevList];
      updatedList[index] = true;
      return updatedList;
    });
  };

  useEffect(() => {
    console.log(courseList);
  }, [courseList]);

  return (
    <div className="courseContainer">
      <div>
        <h2>{dayCount}일차</h2>
      </div>
      {courseList.map((course, index) => (
        <div key={index} className="course">
          <CourseItem
            key={index}
            onCourseInsert={onCourseInsert}
            dayCount={dayCount}
            containerIdx={containerIdx}
            courseIdx={index}
          />
        </div>
      ))}
      <div className="courseAddBtn">
        <button onClick={handleAddCourse}>코스 추가</button>
      </div>
    </div>
  );
};

export default CourseContainer;
