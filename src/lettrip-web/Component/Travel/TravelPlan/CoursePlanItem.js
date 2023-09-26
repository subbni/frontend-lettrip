import { useEffect, useCallback, useState } from "react";

import MapForm from "./MapForm";
import Recommendation from "./Recommendation";

import styles from "./Plan.module.css";

const CoursePlanItem = ({
  onCourseInsert,
  onDeleteBtnClick,
  dayCount,
  containerIdx,
  courseIdx,
  recommendationType,
  recommendationResult,
  province,
  pageForm,
  setPageForm,
  planForm,
  onInputPlaceChange,
}) => {
  const [course, setCourse] = useState({
    id: courseIdx,
    arrivedTime: "",
    cost: "",
    dayCount: dayCount,
    place: {
      name: "",
      categoryCode: "",
      categoryName: "",
      xpoint: "",
      ypoint: "",
      province: "",
      city: "",
    },
  });

  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [btnMessage, setBtnMessage] = useState("등록");

  const [showContents, setShowContents] = useState(false); //내용 숨기기 및 보여주기
  const [recommendationResponse, setRecommendationResponse] = useState(""); //리뷰인지 장소인지

  useEffect(() => {
    setRecommendationResponse(recommendationType);
    console.log(recommendationType);
    console.log(recommendationResponse);
  }, [recommendationType]);

  // MapForm에 전달할 place 선택 함수
  const onPlaceSelect = useCallback(
    (placeInfo) => {
      const newPlace = {
        name: placeInfo.name,
        categoryCode: placeInfo.categoryCode,
        categoryName: placeInfo.categoryName,
        xpoint: placeInfo.xpoint,
        ypoint: placeInfo.ypoint,
        province: placeInfo.province,
        city: placeInfo.city,
        address: placeInfo.address,
      };
      console.log(placeInfo.address);
      setCourse({
        ...course,
        place: newPlace,
      });
      setIsPlaceSelected((isPlaceSelected) => !isPlaceSelected);
      console.log(newPlace);
    },
    [course.place]
  );

  const onChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const onBtnClick = (e) => {
    if (!course.arrivedTime.trim() || !course.cost.trim()) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    setShowContents(showContents); //내용 보이게 하기
    //TravelPlanForm의 courses에 course 등록
    if (confirm) {
      e.preventDefault();
      setBtnMessage("등록");
      setShowContents(!showContents); //내용 보이게 하기
    } else {
      e.preventDefault();
      onCourseInsert(course, course.place);
      setBtnMessage("수정");
      setShowContents(!showContents); //내용 보이게 하기
    }
    setConfirm((confirm) => !confirm);
  };

  const onDeleteClick = (e) => {
    e.preventDefault();
    onDeleteBtnClick(course);
  };

  //계획 내용 보는 버튼
  const showContentBtn = (e) => {
    e.preventDefault();
    setShowContents(!showContents); //내용 보이게 하기
  };

  return (
    <div className={styles.itemContainer}>
      <div className={styles.courseReviewMap}>
        {recommendationResponse === "일반" ? (
          <MapForm
            onPlaceSelect={onPlaceSelect}
            containerIdx={containerIdx}
            courseIdx={courseIdx}
          />
        ) : recommendationResponse === "리뷰" ? (
          <Recommendation
            onPlaceSelect={onPlaceSelect}
            containerIdx={containerIdx}
            courseIdx={courseIdx}
            recommendationResponse={recommendationResponse}
            recommendationResult={recommendationResult}
            province={province}
            pageForm={pageForm}
            setPageForm={setPageForm}
            planForm={planForm}
          />
        ) : recommendationResponse === "장소" ? (
          <Recommendation
            onPlaceSelect={onPlaceSelect}
            containerIdx={containerIdx}
            courseIdx={courseIdx}
            recommendationResponse={recommendationResponse}
            recommendationResult={recommendationResult}
            province={province}
            pageForm={pageForm}
            setPageForm={setPageForm}
            planForm={planForm}
            onInputPlaceChange={onInputPlaceChange}
          />
        ) : null}
      </div>
      {isPlaceSelected ? (
        <div className={styles.itemContentBox}>
          <div className={styles.itemTitle}>
            <label className={styles.titleLabel01}>장소</label>
            <p onClick={showContentBtn} className={styles.titleLabel02}>
              {course.place.name}
            </p>
          </div>
          {!showContents ? (
            <div className={styles.itemShowContent}>
              <div className={styles.itemContent}>
                <label className={styles.contentLabel02}>예상 도착시간</label>
                <input
                  className={styles.content04}
                  type='time'
                  itemContent
                  name='arrivedTime'
                  onChange={onChange}
                  disabled={confirm}
                  required
                  value={course.arrivedTime}
                />
              </div>
              <div className={styles.itemContent}>
                <label className={styles.contentLabel02}>예상 비용</label>
                <input
                  className={styles.content04}
                  type='number'
                  name='cost'
                  onChange={onChange}
                  disabled={confirm}
                  required
                  value={course.cost}
                />
              </div>
            </div>
          ) : null}
          <div className={styles.itembtnContainer}>
            <button onClick={onBtnClick} className={styles.btn06}>
              {btnMessage}
            </button>
            <button onClick={onDeleteClick} className={styles.btn06}>
              삭제
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CoursePlanItem;
