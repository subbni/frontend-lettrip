import React, { useState, useEffect } from "react";
import no_image from "../../../../image/travel/no_image.png";

import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import styles from "./PageDetail.module.css";

const CourseDetail = ({ course }) => {
  useEffect(() => {
    console.log(course);
  }, []);

  const [currentImage, setCurrentImage] = useState(0);
  const [showReview, setShowReview] = useState(false);

  const fileUrls = course?.review?.fileUrls; // fileUrls 선언 및 초기화

  // 이미지 관리
  const renderImages = () => {
    if (fileUrls === null || fileUrls === undefined) {
      return <img className={styles.image} src={no_image} alt='basic' />;
    }
    // 이미지 렌더링 로직
    if (fileUrls.length === 0) {
      return <img className={styles.image} src={no_image} alt='basic' />;
    }
    const handlePrevImage = () => {
      setCurrentImage((prevImage) =>
        prevImage === 0 ? fileUrls.length - 1 : prevImage - 1
      );
    };
    const handleNextImage = () => {
      setCurrentImage((prevImage) =>
        prevImage === fileUrls.length - 1 ? 0 : prevImage + 1
      );
    };

    return (
      <div className={styles.imageContainer}>
        {course.review.fileUrls.length < 2 && (
          <img
            className={styles.image}
            src={course.review.fileUrls[currentImage]}
            alt={`Image ${currentImage + 1}`}
          />
        )}
        {course.review.fileUrls.length > 1 && (
          <div className={styles.imageBox}>
            <button className={styles.prevBtn} onClick={handlePrevImage}>
              {"<"}
            </button>
            <img
              className={styles.image}
              src={course.review.fileUrls[currentImage]}
              alt={`Image ${currentImage + 1}`}
            />
            <button className={styles.nextBtn} onClick={handleNextImage}>
              {">"}
            </button>
          </div>
        )}
      </div>
    );
  };

  // 별점 관리
  const renderStars = () => {
    const totalRating = course.place.totalRating;

    const filledStar = <AiFillStar className={styles.star} />;
    const emptyStar = <AiOutlineStar className={styles.star} />;

    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < totalRating) {
        stars.push(filledStar);
      } else {
        stars.push(emptyStar);
      }
    }
    return stars;
  };

  // 후기 관리
  const handleReviewClick = () => {
    setShowReview(!showReview);
  };

  //시간 표시 관리
  const getKoreanDateTime = (dateString) => {
    const options = {
      timeZone: "Asia/Seoul",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const koreanTime = new Date(dateString).toLocaleTimeString(
      "ko-KR",
      options
    );
    return koreanTime;
  };
  //금액 단위 설정
  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailHeader}>
        <div className={styles.detailTitle}>{course.place.name}</div>
        <div className={styles.detailTime}>
          {getKoreanDateTime(course.arrivedTime)}
        </div>
      </div>
      {renderImages()}
      <div className={styles.detailCost}>{numberWithCommas(course.cost)}원</div>
      <div className={styles.detailFooter}>
        <span className={styles.starBox}>
          {renderStars().map((star, index) => (
            <span key={index}>{star}</span>
          ))}
        </span>
        <span className={styles.detailReviewBox} onClick={handleReviewClick}>
          {showReview ? "닫기" : "후기 ->"}
        </span>
      </div>
      {showReview && (
        <div className={styles.detailReview}>{course.review.detailReview}</div>
      )}
    </div>
  );
};

export default CourseDetail;
