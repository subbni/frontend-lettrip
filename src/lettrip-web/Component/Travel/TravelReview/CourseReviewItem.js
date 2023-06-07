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

    // TravelReviewForm의 courses에 course 등록
    if (confirm) {
      setConfirm((confirm) => !confirm);
      setBtnMessage("등록하기");
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
    <div>
      {isPlaceSelected ? (
        <div>
          <div className='courseComponent'>
            <label>장소</label>
            <p>{course.place.name}</p>
          </div>
          <div className='courseComponent'>
            <label>도착시간</label>
            <input
              type='time'
              name='arrivedTime'
              onChange={onChange}
              disabled={confirm}
              required
            />
          </div>
          <div className='courseComponent'>
            <label>비용</label>
            <input
              type='number'
              name='cost'
              onChange={onChange}
              disabled={confirm}
              required
            />
          </div>
          <div className='courseComponent'>
            <label>별점</label>
            <input
              type='number'
              name='rating'
              min={1}
              max={5}
              onChange={onReviewChange}
              disabled={confirm}
              required
            />
          </div>
          <div className='courseComponent'>
            <label>혼자 가기에도 좋을까요?</label>
            <form className='radioButtonForm'>
              <div className='radio_element'>
                <input
                  type='radio'
                  name='soloFriendlyRating'
                  value={1}
                  onChange={onReviewChange}
                  disabled={confirm}
                />
                <div>네</div>
              </div>
              <div className='radio_element'>
                <input
                  type='radio'
                  name='soloFriendlyRating'
                  value={0}
                  onChange={onReviewChange}
                  disabled={confirm}
                />
                <div>아니오</div>
              </div>
            </form>
          </div>
          <ImageFileForm
            containerIdx={containerIdx}
            courseIdx={courseIdx}
            onImageFileAdd={onImageFileAdd}
            onImageFileDelete={onImageFileDelete}
            confirm={confirm}
          />
          <div className='courseComponent'>
            <div>
              <label>상세 후기</label>
            </div>
            <textarea
              className='detailedReview'
              name='detailedReview'
              onChange={onReviewChange}
              disabled={confirm}
              placeholder='내용을 입력해 주세요.'
            ></textarea>
          </div>
          <div className='courseComponent'>
            <button onClick={onBtnClick} className='submitButton'>
              {btnMessage}
            </button>
            <button onClick={onDeleteClick} className='deleteButton'>
              삭제
            </button>
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
