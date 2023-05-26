/*global kakao*/
import { useCallback, useEffect, useState } from "react";
import MapForm from "./MapForm";

const CourseItem = ({
  onCourseInsert,
  departDate,
  dayCount,
  containerIdx,
  courseIdx,
}) => {
  const [staticMapId, setStaticMapId] = useState(
    containerIdx + "staticMap" + courseIdx
  );
  const [staticMap, setStaticMap] = useState("");
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
  const [btnMessage, setBtnMessage] = useState("확인");

  useEffect(() => {
    if (isPlaceSelected) {
      drawStaticMap();
    }
  }, [isPlaceSelected]);

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

  const drawStaticMap = () => {
    // const marker = {
    //   position: new kakao.maps.LatLng(course.place.xpoint, course.place.ypoint),
    // };
    // const staticMapContainer = document.getElementById({ staticMapId }), // 이미지 지도를 표시할 div
    //   staticMapOption = {
    //     center: new kakao.maps.LatLng(course.place.xpoint, course.place.ypoint), // 이미지 지도의 중심좌표
    //     level: 3, // 이미지 지도의 확대 레벨
    //      marker: marker, // 이미지 지도에 표시할 마커
    //   };
    // // 이미지 지도를 생성합니다
    // const staticMap = new kakao.maps.StaticMap(
    //   staticMapContainer,
    //   staticMapOption
    // );
  };

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

export default CourseItem;
