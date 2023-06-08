import basic_image from "../../../image/basic_image.png";
import medal from "../../../image/medal.png";
import "./PlaceReview.css";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const ReviewItem = ({ review }) => {
  // 별점 관리
  const renderStars = () => {
    const rating = review.rating;

    const filledStar = <FaStar className='searchresult-ratingStarIcon' />;
    const halfStar = <FaStarHalfAlt className='searchresult-ratingStarIcon' />;
    const emptyStar = <FaRegStar className='searchresult-ratingStarIcon' />;

    const stars = [];
    const integerPart = Math.floor(rating); // 정수 부분
    const decimalPart = rating % 1; // 소수 부분

    // 꽉 찬 별
    for (let i = 0; i < integerPart; i++) {
      stars.push(filledStar);
    }
    // 반 별
    if (decimalPart >= 0.5) {
      stars.push(halfStar);
    }
    // 빈 별
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(emptyStar);
    }
    return stars;
  };

  // 메달 관리
  const soloRating = review.soloFriendlyRating;

  return (
    <div className='review_item'>
      <div className='review_item_element'>
        <div>
          <div className='review_writerNickname'>
            작성자 : {review.writerNickname}
          </div>
        </div>
        <div>
          <div className='review_text'>{review.visitTimes}번째 방문</div>
        </div>
      </div>
      <div className='review_item_element'>
        {review.fileUrls.length === 0 ? (
          <img className='review_img' src={basic_image} />
        ) : (
          <img className='review_img' src={review.fileUrls[0]} />
        )}
        <div className='review_info_item'>
          <div className='review_rating'>
            <span className='searchresult-ratingStars'>
              {renderStars().map((star, index) => (
                <span key={index}>{star}</span>
              ))}
            </span>
            <p className='review-rating-text'>{review.rating}점</p>
          </div>
          <div className='review_detailReview_container'>
            <div className='review_detailReview'>
              {review.detailReview.substring(0, 55)}
              {review.detailReview.length > 55 ? (
                <span className='detailReview_cut'> ...중략</span>
              ) : null}
            </div>
          </div>
        </div>
        {soloRating === 1 && (
          <div className='review-medal'>
            <p className='recommend-solo-travel'>혼자 여행가기 추천</p>
            <img className='review-medal-image' src={medal} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;
