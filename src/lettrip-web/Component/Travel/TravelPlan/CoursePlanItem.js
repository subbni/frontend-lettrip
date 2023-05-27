/*global kakao*/
import { useCallback, useEffect, useState } from "react";
import MapForm from "./MapForm";

const CoursePlanItem = ({
  onCourseInsert,
  dayCount,
  containerIdx,
  courseIdx,
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
    review: {
      fileNames: [],
      detailedReview: "",
      rating: "",
      soloFriendlyRating: "",
    },
  });
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [btnMessage, setBtnMessage] = useState("확인");

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

  const onBtnClick = useCallback(() => {
    if (!course.arrivedTime.trim() || !course.cost.trim()) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    // TravelPlanForm의 courese에 course 등록
    onCourseInsert(course, course.place);
    setConfirm(true);
    setBtnMessage("수정하기");
  });

  return (
    <div>
      {isPlaceSelected ? (
        <div>
          <div className="courseComponent">
            <label>장소</label>

            <p>{course.place.name}</p>
          </div>
          <div className="courseComponent">
            <label>예상 도착시간</label>
            <input
              type="time"
              name="arrivedTime"
              id={course.arrivedTime}
              onChange={onChange}
              disabled={confirm}
              required
            />
          </div>
          <div className="courseComponent">
            <label>예상 비용</label>
            <input
              type="text"
              name="cost"
              id={course.cost}
              onChange={onChange}
              disabled={confirm}
              required
            />
          </div>
          <div className="courseComponent">
            <button onClick={onBtnClick}>{btnMessage}</button>
          </div>
        </div>
      ) : (
        <MapForm
          onPlaceSelect={onPlaceSelect}
          containerIdx={containerIdx}
          courseIdx={courseIdx}
        />
      )}
    </div>
  );
};

export default CoursePlanItem;
