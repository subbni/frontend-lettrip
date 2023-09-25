import { useCallback, useState } from "react";
import MapForm from "./MapForm";
import styles from "./Plan.module.css";

const CoursePlanItem = ({
  onCourseInsert,
  onDeleteBtnClick,
  dayCount,
  containerIdx,
  courseIdx,
  mainImageName,
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

  //더보기 버튼 설정하기 (세부사항)
  const [showPlans, setShowPlans] = useState(false);

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
      };
      setCourse({
        ...course,
        place: newPlace,
      });
      setIsPlaceSelected((isPlaceSelected) => !isPlaceSelected);
    },
    [course.place]
  );

  const onChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const onBtnClick = () => {
    if (!course.arrivedTime.trim() || !course.cost.trim()) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    //TravelPlanForm의 courses에 course 등록
    if (confirm) {
      setBtnMessage("등록");
    } else {
      onCourseInsert(course, course.place);
      setShowPlans(!showPlans);
      setBtnMessage("수정");
    }
    setConfirm((confirm) => !confirm);
  };

  const onDeleteClick = () => {
    onDeleteBtnClick(course);
  };

  //더보기 버튼 설정하기
  const btnShowContents = () => {
    //펼치기 눌렀을 때
    setShowPlans(!showPlans);
  };

  return (
    <div className={styles.itemContainer}>
      <div className={styles.courseReviewMap}>
        <MapForm
          onPlaceSelect={onPlaceSelect}
          containerIdx={containerIdx}
          courseIdx={courseIdx}
        />
      </div>
      {isPlaceSelected ? (
        <div className={styles.itemContentBox}>
          <div className={styles.itemTitle}>
            <label className={styles.titleLabel01}>장소</label>
            <p className={styles.titleLabel02}>{course.place.name}</p>
          </div>
          {!showPlans ? (
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
