import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal"; //overlay 라이브러리 사용하기

import styles from "./TravelPlan.module.css";
import CourseItem from "./CourseItem";

const CoursePlanContainer = ({
  key,
  containerIdx,
  dayCount,
  onCourseInsert,
  onCourseDelete,
  planForm,
  inputPlace,
}) => {
  const [coursePlanSubmit, SetCoursePlanSubmit] = useState(false); //코스 계획
  const courseId = useRef(0);
  const [courseList, setCourseList] = useState([]);
  const [isSearchClickedList, setIsSearchClickedList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 1,
    input_place: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 일반 열림/닫힘 상태
  const [isItemModalOpen, setIsItemModalOpen] = useState(false); // 리뷰 열림/닫힘 상태
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false); // 장소 열림/닫힘 상태

  useEffect(() => {}, [planForm.departDate]);

  useEffect(() => {
    console.log(courseList);
  }, [courseList]);

  useEffect(() => {
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
  const OnAddCourse = (e) => {
    setIsAddModalOpen(true);
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

  //리뷰 기반 추천
  const OnItemCourse = (e) => {
    setIsItemModalOpen(true);
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

  // 장소 기반 추천 함수
  const OnPlaceCourse = (e) => {
    setIsPlaceModalOpen(true);
    e.preventDefault();
    setCourseList([
      ...courseList,
      {
        courseId: containerIdx + "-" + courseId.current,
      },
    ]);
    setIsSearchClickedList([...isSearchClickedList, false]);
    courseId.current += 1;
    // 장소 체크
    if (pageForm.input_place.trim() === "") {
      alert("최소 1개의 장소 등록이 필요합니다! 장소 등록을 먼저 해주세요!");
      return;
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsItemModalOpen(false);
    setIsPlaceModalOpen(false);
  };

  return (
    <div className={styles.coursePlanPage}>
      <div className={styles.coursePlanContainer}>
        <h3> {dayCount}일차 </h3>
        <div className={styles.coursePlanBox}>
          {!coursePlanSubmit ? (
            <div>
              {courseList.map((course) => (
                <div key={course.courseId} className={styles.coursePlanAddBtn}>
                  <button onClick={OnAddCourse}>직접 코스 추가</button>
                  <Modal
                    isOpen={isAddModalOpen}
                    onRequestClose={closeModal}
                    contentLabel='직접 코스 추가'
                  >
                    <h2>직접 코스 추가</h2>
                    <CourseItem />
                    <button onClick={closeModal}>닫기</button>
                  </Modal>
                  <button onClick={OnItemCourse}>리뷰 기반 추천</button>
                  <Modal
                    isOpen={isItemModalOpen}
                    onRequestClose={closeModal}
                    contentLabel='리뷰 기반 추천'
                  >
                    <h2>리뷰 기반 추천</h2>
                    <CourseItem />
                    <button onClick={closeModal}>닫기</button>
                  </Modal>
                  <button onClick={OnPlaceCourse}>장소 기반 추천</button>
                  <Modal
                    isOpen={isPlaceModalOpen}
                    onRequestClose={closeModal}
                    contentLabel='장소 기반 추천'
                  >
                    <h2>장소 기반 추천</h2>
                    <CourseItem />
                    <button onClick={closeModal}>닫기</button>
                  </Modal>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.coursePlanItem}>
              <span>장소</span>
              <span>장소 이름</span>
              <div className={styles.coursePlanOptionBtn}>
                <button>수정</button>
                <button>삭제</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlanContainer;
