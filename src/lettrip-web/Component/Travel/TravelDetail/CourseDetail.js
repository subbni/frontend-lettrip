import React, { useState, useEffect } from "react";
import basic_Image from "../../../../image/basic.png";
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
  const [liked, setLiked] = useState(false);

  // 이미지 관리
  const renderImages = () => {
    if (course.review.fileUrls.length === 0) {
      return <img className='basic-image' src={basic_Image} alt='basic' />;
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
      <div className='result-image'>
        <div className='image-container'>
          {course.review.fileUrls.length < 2 && (
            <img
              className='current-image'
              src={course.review.fileUrls[currentImage]}
              alt={`Image ${currentImage + 1}`}
            />
          )}
          {course.review.fileUrls.length > 1 && (
            <div className='image-navigation'>
              <button className='prev-button' onClick={handlePrevImage}>
                {"<"}
              </button>
              <img
                className='current-image'
                src={course.review.fileUrls[currentImage]}
                alt={`Image ${currentImage + 1}`}
              />
              <button className='next-button' onClick={handleNextImage}>
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

    const filledStar = <AiFillStar className='rating-starIcon' />;
    const emptyStar = <AiOutlineStar className='rating-starIcon' />;

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
  const [showReview, setShowReview] = useState(false);
  const handleReviewClick = () => {
    setShowReview(!showReview);
  };

  // 좋아요 관리
  const handleLikeClick = () => {
    setLiked(!liked);
  };

  return (
    <div className='result-container'>
      <div className='result-title'>{course.place.name}</div>
      <button className='like-button' onClick={handleLikeClick}>
        {liked ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>

      <div className='result-dayCountArrivedTime'>
        <div className='result-dayCount'>{course.dayCount}일차</div>
        <div className='result-arrivedTime'>{course.arrivedTime}</div>
      </div>
      {renderImages()}
      <div className='result-cost'>{course.cost}원</div>
      <div className='result-ratingreview'>
        <span className='review-stars'>
          {renderStars().map((star, index) => (
            <span key={index}>{star}</span>
          ))}
        </span>
        <span className='review-click' onClick={handleReviewClick}>
          {showReview ? "닫기" : "후기 ->"}
        </span>
      </div>
      {showReview && (
        <div className='result-review'>
          <div className='review-content'>{course.review.detailReview}</div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
