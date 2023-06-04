/*global kakao*/
import { useCallback, useEffect, useState } from "react";
import MapForm from "./MapForm";

const CoursePlanItem = ({
  onCourseInsert,
  onDeleteBtnClick,
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
  });
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [btnMessage, setBtnMessage] = useState("등록하기");

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
      setBtnMessage("등록하기");
    } else {
      onCourseInsert(course, course.place);
      setBtnMessage("수정하기");
    }
    setConfirm((confirm) => !confirm);
  };

  const onDeleteClick = () => {
    onDeleteBtnClick(course);
  };

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
              onChange={onChange}
              disabled={confirm}
              required
            />
          </div>
          <div className="courseComponent">
            <label>예상 비용</label>
            <input
              type="number"
              name="cost"
              onChange={onChange}
              disabled={confirm}
              required
            />
          </div>
          <div className="courseComponent">
            <button onClick={onBtnClick} className="submitButton">{btnMessage}</button>
            <button onClick={onDeleteClick} className="deleteButton">삭제</button>
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
