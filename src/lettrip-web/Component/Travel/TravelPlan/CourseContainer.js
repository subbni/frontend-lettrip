import React, { useEffect, useRef, useState } from "react";
import "./Plan.css";
import MapForm from "./MapForm";
import CoursePlanItem from "./CoursePlanItem";

const CourseContainer = ({
  onCourseInsert,
  onCourseDelete,
  departDate,
  dayCount,
  containerIdx,
}) => {
  const courseId = useRef(0);
  const [courseList, setCourseList] = useState([]);
  const [isSearchClickedList, setIsSearchClickedList] = useState([]);

  const handleAddCourse = (e) => {
    e.preventDefault();
    setCourseList([
      ...courseList,
      {
        courseId: containerIdx + "-" + courseId.current,
      },
    ]);
    setIsSearchClickedList([...isSearchClickedList, false]);
    courseId.current += 1;
  };

  const handleSearchBtnClick = (index, e) => {
    e.preventDefault();
    setIsSearchClickedList((prevList) => {
      const updatedList = [...prevList];
      updatedList[index] = true;
      return updatedList;
    });
  };

  const onDeleteBtnClick = (course) => {
    if (window.confirm("해당 코스를 삭제합니다.")) {
      console.log(course);
      setCourseList(
        courseList.filter((element) => element.courseId !== course.id)
      );
      onCourseDelete(course);
    }
  };

  useEffect(() => {
    console.log(courseList);
  }, [courseList]);

  useEffect(() => {}, [departDate]);
  return (
    <div className="courseContainer">
      <div>
        <h2>{dayCount}일차</h2>
      </div>
      {courseList.map((course) => (
        <div key={course.courseId} className="course">
          <CoursePlanItem
            onCourseInsert={onCourseInsert}
            onDeleteBtnClick={onDeleteBtnClick}
            departDate={departDate}
            dayCount={dayCount}
            containerIdx={containerIdx}
            courseIdx={course.courseId}
          />
        </div>
      ))}
      <div>
        <button className="courseAddBtn" onClick={handleAddCourse}>코스 추가</button>
      </div>
    </div>
  );
};

export default CourseContainer;
