import { useCallback, useState, useEffect } from "react";
import MapForm from "../TravelPlan/MapForm";
import ImageFileForm from "./ImageFileForm";
import {
  AiOutlineDown,
  AiFillCheckSquare,
  AiOutlineCheckSquare,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

import styles from "./Review.module.css";

const CourseReviewItem = ({
  onCourseInsert,
  onDeleteBtnClick,
  dayCount,
  containerIdx,
  courseIdx,
  onMainImageSet,
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

  const [mainImage, setMainImage] = useState(null);

  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [btnMessage, setBtnMessage] = useState("등록하기");

  //더보기 버튼 설정하기 (세부사항)
  const [showPlans, setShowPlans] = useState(false);
  const [showmorePlans, setShowmorePlans] = useState(false);

  const [userRating, setUserRating] = useState(0); // 사용자가 입력한 별점
  const [soloFriendlyRating, setSoloFriendlyRating] = useState(0); // 혼자가기 추천 여부

  const [showContents, setShowContents] = useState(false); //내용 숨기기 및 보여주기
  const [showFormBtn, setShowFormBtn] = useState(false); //버튼 숨기기 및 보여주기

  useEffect(() => {
    console.log("mainImage 상태가 변경되었습니다.", mainImage);
  }, [mainImage]);

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

  // 별점 관리
  const handleStarClick = (rating) => {
    setUserRating(rating);
    setReview((prevReview) => ({
      ...prevReview,
      rating: String(rating), // 문자열 형태로 저장
    }));
  };
  const onBtnClick = (e) => {
    if (!course.arrivedTime.trim() || !course.cost.trim()) {
      alert("모든 정보를 입력해주세요.");
      return;
    }
    // TravelReviewForm의 courses에 course 등록
    if (confirm) {
      e.preventDefault();
      setConfirm((confirm) => !confirm);
      setBtnMessage("등록하기");
      setShowContents(!showContents); //내용 보이게 하기
    } else {
      e.preventDefault();
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
      setShowContents(!showContents); //내용 보이게 하기
    }
  };
  //혼자가기 추천
  const handleSoloFriendlyClick = (e) => {
    e.preventDefault();
    const newSoloFriendlyRating = soloFriendlyRating === 0 ? 1 : 0;
    setSoloFriendlyRating(newSoloFriendlyRating);
    setReview((prevReview) => ({
      ...prevReview,
      soloFriendlyRating: String(newSoloFriendlyRating), // 문자열 형태로 저장
    }));
  };

  const onDeleteClick = (e) => {
    e.preventDefault();
    onDeleteBtnClick(course, fileNames, imageFiles);
  };

  //계획 내용 보는 버튼
  const showContentBtn = (e) => {
    e.preventDefault();
    setShowContents(!showContents); //내용 보이게 하기
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
            <p onClick={showContentBtn} className={styles.titleLabel02}>
              {course.place.name}
            </p>
          </div>
          {!showContents ? (
            <div className={styles.itemShowContainer}>
              <div className={styles.itemShowContent}>
                <div className={styles.itemContent01}>
                  <label className={styles.contentLabel02}>도착시간</label>
                  <input
                    className={styles.content04}
                    type='time'
                    name='arrivedTime'
                    onChange={onChange}
                    disabled={confirm}
                    required
                    value={course.arrivedTime}
                  />
                </div>
                <div className={styles.itemContent01}>
                  <label className={styles.contentLabel02}>비용</label>
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
                <div className={styles.itemContent01}>
                  <label className={styles.contentLabel02}>별점</label>
                  <span className={styles.starBox}>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <span
                        key={rating}
                        onClick={() => handleStarClick(rating)}
                        required
                        disabled={confirm}
                        value={review.rating}
                        className={
                          rating <= userRating
                            ? styles.starFilled
                            : styles.starEmpty
                        }
                      >
                        {rating <= userRating ? (
                          <AiFillStar className={styles.star} />
                        ) : (
                          <AiOutlineStar className={styles.star} />
                        )}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
              <div
                className={styles.itemContent02}
                onClick={handleSoloFriendlyClick}
                disabled={confirm}
                value={review.soloFriendlyRating}
                required
              >
                {soloFriendlyRating === 1 ? (
                  <AiFillCheckSquare className={styles.checkbox} />
                ) : (
                  <AiOutlineCheckSquare className={styles.checkbox} />
                )}
                <label className={styles.contentLabel03}>혼자가기 추천</label>
              </div>
              <ImageFileForm
                containerIdx={containerIdx}
                courseIdx={courseIdx}
                onImageFileAdd={onImageFileAdd}
                onImageFileDelete={onImageFileDelete}
                confirm={confirm}
                imageFiles={imageFiles}
                fileNames={fileNames}
                onMainImageSet={onMainImageSet}
              />
              <div className={styles.itemContent03}>
                <div>
                  <label className={styles.contentLabel04}>후기</label>
                </div>
                <textarea
                  className={styles.courseContent03}
                  name='detailedReview'
                  onChange={onReviewChange}
                  disabled={confirm}
                  placeholder='내용을 입력해 주세요.'
                  required
                  value={review.detailedReview}
                ></textarea>
              </div>
            </div>
          ) : (
            <div className={styles.btn02} onClick={showContentBtn}>
              <AiOutlineDown className={styles.icon01} />
              <p className={styles.btnLabel01}>더보기</p>
            </div>
          )}
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

export default CourseReviewItem;
