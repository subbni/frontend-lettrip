import React, { useEffect, useRef, useState } from "react";
import CoursePlanItem from "./CoursePlanItem";
import CommendItem from "./CommendItem";

import { recommendItem, recommendPlace } from "../../../Service/TravelService";
import styles from "./Plan.module.css";

const CourseContainer = ({
  onCourseInsert,
  onCourseDelete,
  departDate,
  dayCount,
  containerIdx,
  planForm,
  mainImageName,
}) => {
  const courseId = useRef(0);
  const [courseList, setCourseList] = useState([]);
  const [isSearchClickedList, setIsSearchClickedList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 1,
    input_place: "",
  });
  const [recommendationResult, setRecommendationResult] = useState(null);

  // 장소 입력 버튼을 눌렀을 때 호출되는 함수
  const handlePlaceInputChange = (e) => {
    const newPlace = e.target.value;
    setPageForm((prevForm) => ({
      ...prevForm,
      place: newPlace,
    }));
  };

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

  //리뷰 기반 추천
  const recommendItemClick = (e) => {
    e.preventDefault();
    setCourseList([
      ...courseList,
      {
        courseId: containerIdx + "-" + courseId.current,
      },
    ]);
    setIsSearchClickedList([...isSearchClickedList, false]);
    courseId.current += 1;
    recommendItem(planForm, pageForm)
      .then((response) => {
        setRecommendationResult(response);
        console.log(response);
      })
      .catch((e) => {
        alert("오류가 발생했습니다.");
        console.log(e);
      });
  };

  // 장소 기반 추천 함수
  const recommendPlaceClick = (e) => {
    e.preventDefault();
    setCourseList([
      ...courseList,
      {
        courseId: containerIdx + "-" + courseId.current,
      },
    ]);
    setIsSearchClickedList([...isSearchClickedList, false]);
    courseId.current += 1;

    recommendPlace(planForm, pageForm)
      .then((response) => {
        console.log(response);
        console.log(pageForm);
      })
      .catch((e) => {
        alert("오류가 발생했습니다.");
        console.log(e);
      });
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
            mainImageName={mainImageName}
          />
        </div>
      ))}
      <div className={styles.btnContainer}>
        <button className={styles.btn04} onClick={handleAddCourse}>
          코스 추가
        </button>
        <input
          type='text'
          placeholder='장소 입력'
          value={pageForm.input_place}
          onChange={(e) => {
            const newPlace = e.target.value;
            setPageForm((prevForm) => ({
              ...prevForm,
              input_place: newPlace, // 여기를 input_place로 수정
            }));
          }}
        />
        <button className={styles.btn05} onClick={recommendItemClick}>
          리뷰 기반 추천
        </button>
        <button className={styles.btn05} onClick={recommendPlaceClick}>
          장소 기반 추천
        </button>
      </div>
    </div>
  );
};

export default CourseContainer;
