import React, { useEffect, useRef, useState } from "react";
import CoursePlanItem from "./CoursePlanItem";

import { recommendItem, recommendPlace } from "../../../Service/TravelService";
import styles from "./Plan.module.css";

const CourseContainer = ({
  onCourseInsert,
  onCourseDelete,
  departDate,
  dayCount,
  containerIdx,
  planForm,
}) => {
  const courseId = useRef(0);
  const [courseList, setCourseList] = useState([]);
  const [isSearchClickedList, setIsSearchClickedList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 1,
    input_place: "",
  });
  const [inputPlace, setInputPlace] = useState("");

  const [recommendationResult, setRecommendationResult] = useState([]);
  const [recommendationType, setRecommendationType] = useState("");

  useEffect(() => {
    console.log(courseList);
  }, [courseList]);

  useEffect(() => {
    if (pageForm.input_place.trim() !== "") {
      recommendPlaceShow({ preventDefault: () => {} }); //자동으로 장소 추천 머신러닝 실행되게 하기
    }
  }, [pageForm.input_place]);

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

  //코스 추가 버튼 눌렀을 때
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
    setRecommendationType("일반");
    console.log(recommendationType);
  };

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
    setRecommendationType("리뷰");
    recommendItem(planForm, pageForm)
      .then((response) => {
        console.log(response);
        setRecommendationResult(response);
      })
      .catch((e) => {
        alert("오류가 발생했습니다.");
        console.log(e);
      });
  };

  //장소 입력 가져오기
  const onInputPlaceChange = (place) => {
    const newplace = place;
    setPageForm((prevForm) => ({
      ...prevForm,
      input_place: newplace,
    }));
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
    setRecommendationType("장소");
    // 장소 입력 체크
    if (pageForm.input_place.trim() === "") {
      alert("장소를 먼저 입력해주세요.");
      return;
    }
  };

  const recommendPlaceShow = (e) => {
    e.preventDefault();
    // 장소 기반 추천 실행
    recommendPlace(planForm, pageForm)
      .then((response) => {
        console.log(response);
        setRecommendationResult(response);
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
            recommendationType={recommendationType}
            recommendationResult={recommendationResult}
            province={planForm.province}
            pageForm={pageForm}
            setPageForm={setPageForm}
            planForm={planForm}
            onInputPlaceChange={onInputPlaceChange}
          />
        </div>
      ))}
      <div className={styles.btnContainer}>
        <button className={styles.btn04} onClick={handleAddCourse}>
          코스 추가
        </button>
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
