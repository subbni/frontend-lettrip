import { useCallback, useState } from "react";
import MapForm from "../TravelPlan/MapForm";
import ImageFileForm from "./ImageFileForm";

const CourseReviewItem = ({
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
    review: {
      fileNames: [],
      detailedReview: "",
      rating: "",
      soloFriendlyRating: "",
    },
  });
  const [review, setReview] = useState({
    fileNames: [],
    detailedReview: "",
    rating: "",
    soloFriendlyRating: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [btnMessage, setBtnMessage] = useState("확인");
  const [isDeleted, setIsDeleted] = useState(false);

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

  const onReviewChange = (e) => {
    setReview({
      ...review,
      [e.target.name]: e.target.value,
    });
    console.log(review);
  };

  const onImageFileAdd = (fileLists) => {
    setImageFiles(fileLists);
    const fileNameLists = fileLists.map((file) => file.name);
    setFileNames(fileNameLists);
    console.log(fileNames);
  };

  const onImageFileDelete = (id) => {
    setImageFiles(imageFiles.filter((_, index) => index !== id));
    setFileNames(fileNames.filter((_, index) => index !== id));
  };

  const onBtnClick = () => {
    if (!course.arrivedTime.trim() || !course.cost.trim()) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    // TravelPlanForm의 courese에 course 등록
    if (confirm) {
      setConfirm((confirm) => !confirm);
      setBtnMessage("확인");
    } else {
      setReview((review) => ({
        ...review,
        fileNames: fileNames,
      }));
      setCourse((course) => ({
        ...course,
        review: review,
      }));
      onCourseInsert(course, review, fileNames, imageFiles);
      setConfirm((confirm) => !confirm);
      setBtnMessage("수정하기");
    }
  };

  const onDeleteClick = () => {
    onDeleteBtnClick(course, fileNames, imageFiles);
  };
  return (
    <div className="course" disabled={isDeleted}>
      {isPlaceSelected ? (
        <div>
          <div className="courseComponent">
            <label>장소</label>
            <p>{course.place.name}</p>
          </div>
          <div className="courseComponent">
            <label>도착시간</label>
            <input
              type="time"
              name="arrivedTime"
              onChange={onChange}
              disabled={confirm}
              required
            />
          </div>
          <div className="courseComponent">
            <label>비용</label>
            <input
              type="text"
              name="cost"
              onChange={onChange}
              disabled={confirm}
              required
            />
          </div>
          <div className="courseComponent">
            <label>별점</label>
            <input
              type="number"
              name="rating"
              min={1}
              max={5}
              onChange={onReviewChange}
              disabled={confirm}
              required
            />
          </div>
          <div className="courseComponent">
            <label>혼자 가기에도 좋을까요?</label>
            <form>
              <input
                type="radio"
                name="soloFriendlyRating"
                value={1}
                onChange={onReviewChange}
                disabled={confirm}
              />
              네
              <input
                type="radio"
                name="soloFriendlyRating"
                value={0}
                onChange={onReviewChange}
                disabled={confirm}
              />
              아니오
            </form>
          </div>
          <ImageFileForm
            containerIdx={containerIdx}
            courseIdx={courseIdx}
            onImageFileAdd={onImageFileAdd}
            onImageFileDelete={onImageFileDelete}
            disabled={confirm}
          />
          <div className="courseComponent">
            <label>상세 후기</label>
            <textarea
              name="detailedReview"
              onChange={onReviewChange}
              disabled={confirm}
            ></textarea>
          </div>
          <div className="courseComponent">
            <button onClick={onBtnClick}>{btnMessage}</button>
            <button onClick={onDeleteClick}>삭제</button>
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

export default CourseReviewItem;
