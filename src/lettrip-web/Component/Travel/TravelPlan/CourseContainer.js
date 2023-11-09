import React, { useEffect, useRef, useState } from "react";
import CoursePlanItem from "./CoursePlanItem";
import styles from "./Plan.module.css";

const CourseContainer = ({
  onCourseInsert,
  onCourseDelete,
  departDate,
  dayCount,
  containerIdx,
  planForm,
  inputPlace,
}) => {
  const courseId = useRef(0);
  const [courseList, setCourseList] = useState([]);
  const [focusIndex, setFocusIndex] = useState("");
  const [isSearchClickedList, setIsSearchClickedList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 1,
    input_place: "",
  });
  const [recommendationType, setRecommendationType] = useState("");

  useEffect(() => {
    console.log(courseList);
  }, [courseList]);

  useEffect(() => {
    console.log(inputPlace);
    setPageForm((prevPageForm) => ({
      ...prevPageForm,
      input_place: inputPlace,
    }));
  }, [inputPlace]);

  const onDeleteBtnClick = (course) => {
    if (window.confirm("해당 코스를 삭제합니다.")) {
      console.log(course);
      setCourseList(
        courseList.filter((element) => element.courseId !== course.id)
      );
      onCourseDelete(course);
    }
  };

  //코스 추가 버튼 눌렀을 때
  const handleAddCourse = (e) => {
    e.preventDefault();
    setCourseList([
      ...courseList,
      {
        courseId: containerIdx + "-" + courseId.current,
        courseType: "일반",
      },
    ]);
    setIsSearchClickedList([...isSearchClickedList, false]);
    setFocusIndex(containerIdx + "-" + courseId.current);
    courseId.current += 1;
    setRecommendationType("일반");
  };

  //리뷰 기반 추천
  const recommendItemClick = (e) => {
    e.preventDefault();
    setCourseList([
      ...courseList,
      {
        courseId: containerIdx + "-" + courseId.current,
        courseType: "리뷰",
      },
    ]);
    setFocusIndex(containerIdx + "-" + courseId.current);
    setIsSearchClickedList([...isSearchClickedList, false]);
    courseId.current += 1;
    setRecommendationType("리뷰");
  };

  // 장소 기반 추천 함수
  const recommendPlaceClick = (e) => {
    e.preventDefault();
    // !! 장소 체크 먼저 !!
    if (pageForm.input_place.trim() === "") {
      setRecommendationType("장소");
      alert("최소 1개의 장소 등록이 필요합니다! 장소 등록을 먼저 해주세요!");
      return;
    }
    setCourseList([
      ...courseList,
      {
        courseId: containerIdx + "-" + courseId.current,
        courseType: "장소",
      },
    ]);
    setFocusIndex(containerIdx + "-" + courseId.current);
    setIsSearchClickedList([...isSearchClickedList, false]);
    courseId.current += 1;
  };

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
            recommendationType={course.courseType}
            province={planForm.province}
            pageForm={pageForm}
            setPageForm={setPageForm}
            planForm={planForm}
            courseList={courseList}
            focusIndex={focusIndex}
          />
        </div>
      ))}
      <div className={styles.btnContainer}>
        <button className={styles.btn04} onClick={handleAddCourse}>
          코스 추가
        </button>
        <div>
          <button className={styles.btn05} onClick={recommendItemClick}>
            리뷰 기반 추천
          </button>
          <button className={styles.btn05} onClick={recommendPlaceClick}>
            장소 기반 추천
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseContainer;
