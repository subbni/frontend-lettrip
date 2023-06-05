import { useState, useEffect } from "react";
import basic_Image from "../../../../image/basic.png";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import "./PageDetail.css";

const CourseDetail = ({ course }) => {
  useEffect(() => {
    console.log(course);
  }, []);

  //이미지 관리
  const renderImages = () => {
    if (course.review.fileUrls.length === 0) {
      return <img className='basic_Image' src={basic_Image} alt='basic' />;
    } //첨부한 이미지가 없을 경우
    return course.review.fileUrls.map((imageUrl, index) => (
      <img key={index} src={imageUrl} alt={`Image ${index + 1}`} />
    )); //첨부된 이미지가 있을 경우
  };

  //별점 관리
  const renderStars = () => {
    const totalRating = course.place.totalRating;
    console.log(totalRating);

    const filledStar = <AiFillStar className='Rating_StarIcon' />;
    const emptyStar = <AiOutlineStar className='Rating_StarIcon' />;

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

  //후기 관리
  const [showReview, setShowReview] = useState(false);
  const handleReviewClick = () => {
    setShowReview(!showReview);
  };

  return (
    <div className='ResultContainer'>
      <div className='Result_title'>{course.place.name}</div>
      <div className='Result_dayCountArrivedTime'>
        <div className='Result_dayCount'>{course.dayCount}일차</div>
        <div className='Result_arrivedTime'>{course.arrivedTime}</div>
      </div>
      <div className='Result_image'>{renderImages()}</div>
      <div className='Result_cost'>{course.cost}원</div>
      <div className='Result_ratingreview'>
        <span className='Review_stars'>
          {renderStars().map((star, index) => (
            <span key={index}>{star}</span>
          ))}
        </span>
        <span className='Review_click' onClick={handleReviewClick}>
          {showReview ? "닫기" : "후기 ->"}
        </span>
      </div>
      {showReview && (
        <div className='Result_review'>
          <div className='Review_content'>{course.review.detailReview}</div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
