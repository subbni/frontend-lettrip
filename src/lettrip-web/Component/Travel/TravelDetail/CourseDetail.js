import React, { useState, useEffect } from "react";
import no_image from "../../../../image/travel/no_image.png";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import "./PageDetail.css";

const CourseDetail = ({ course }) => {
  useEffect(() => {
    console.log(course);
  }, []);

  const [currentImage, setCurrentImage] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [liked, setLiked] = useState(false);

  // 이미지 관리
  const renderImages = () => {
    if (course.review.fileUrls.length === 0) {
      return <img className='basic-image' src={no_image} alt='basic' />;
    }
    const handlePrevImage = () => {
      setCurrentImage((prevImage) =>
        prevImage === 0 ? course.review.fileUrls.length - 1 : prevImage - 1
      );
    };
    const handleNextImage = () => {
      setCurrentImage((prevImage) =>
        prevImage === course.review.fileUrls.length - 1 ? 0 : prevImage + 1
      );
    };

    return (
      <div className='searchresult-images'>
        <div className='searchresult-image-container'>
          {course.review.fileUrls.length < 2 && (
            <img
              className='searchresult-image'
              src={course.review.fileUrls[currentImage]}
              alt={`Image ${currentImage + 1}`}
            />
          )}
          {course.review.fileUrls.length > 1 && (
            <div className='searchresult-image-navigation'>
              <button className='image-prev-button' onClick={handlePrevImage}>
                {"<"}
              </button>
              <img
                className='searchresult-image'
                src={course.review.fileUrls[currentImage]}
                alt={`Image ${currentImage + 1}`}
              />
              <button className='image-next-button' onClick={handleNextImage}>
                {">"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 별점 관리
  const renderStars = () => {
    const totalRating = course.place.totalRating;

    const filledStar = <AiFillStar className='searchresult-ratingStarIcon' />;
    const emptyStar = <AiOutlineStar className='searchresult-ratingStarIcon' />;

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

  // 좋아요 관리
  const handleLikeClick = () => {
    setLiked(!liked);
  };

  //시간 표시 관리
  const getKoreanDateTime = (dateString) => {
    const options = {
      timeZone: "Asia/Seoul",
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const koreanDate = new Date(dateString).toLocaleString("ko-KR", options);
    const [year, month, day, timePart] = koreanDate.split(". ");
    return `${year}/${month}/${day} ${timePart}`;
  };

  return (
    <div className='searchresult-container'>
      <div className='searchresult-header'>
        <div className='searchresult-title'>{course.place.name}</div>
        <button className='searchresult-like-button' onClick={handleLikeClick}>
          {liked ? <AiFillHeart /> : <AiOutlineHeart />}
        </button>
      </div>
      <div className='searchresult-dayCountArrivedTime'>
        <div className='searchresult-dayCount'>{course.dayCount}일차</div>
        <div className='searchresult-arrivedTime'>
          {getKoreanDateTime(course.arrivedTime)}
        </div>
      </div>
      {renderImages()}
      <div className='searchresult-cost'>{course.cost}원</div>
      <div className='searchresult-ratingreview'>
        <span className='searchresult-ratingStars'>
          {renderStars().map((star, index) => (
            <span key={index}>{star}</span>
          ))}
        </span>
        <span className='searchresult-review-click' onClick={handleReviewClick}>
          {showReview ? "닫기" : "후기 ->"}
        </span>
      </div>
      {showReview && (
        <div className='searchresult-review'>
          <div className='searchresult-content'>
            {course.review.detailReview}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
