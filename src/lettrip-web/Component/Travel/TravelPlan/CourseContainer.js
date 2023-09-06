import React, { useEffect, useRef, useState } from "react";
import CoursePlanItem from "./CoursePlanItem";

import styles from "./Plan.module.css";

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
    <div className={styles.courseContainer}>
      <div className={styles.dayCount}>{dayCount}일차</div>
      {courseList.map((course) => (
        <div key={course.courseId} className={styles.courseContent}>
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
      <div className={styles.btnContainer}>
        <button className={styles.btn_03} onClick={handleAddCourse}>
          코스 추가
        </button>
        <button className={styles.btn_04}>리뷰 기반 추천</button>
        <button className={styles.btn_04}>장소 기반 추천</button>
      </div>
    </div>
  );
};

export default CourseContainer;
