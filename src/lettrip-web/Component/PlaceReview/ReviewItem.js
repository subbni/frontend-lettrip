import no_image from "../../../image/travel/no_image.png";
import no_profile_image from "../../../image/no_profile_image.png";
import medal from "../../../image/place/verified_Badge.svg.png";
import "./PlaceReview.css";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";

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
          <div className='writerInfo'>
            {review.writerImageUrl === null ? (
              <img className='writerImage' src={no_profile_image} />
            ) : (
              <img className='writerImage' src={review.writerImageUrl} />
            )}
            <div className='writerNickname'>{review.writerNickname}</div>
          </div>
        </div>
        <div>
          <div className='review_text'>{review.visitTimes}번째 방문</div>
        </div>
        {soloRating === 1 && (
          <div className='review-medal'>
            <BsCheck2Circle />
            <div className='recommend-solo-travel'>혼자 가기 추천</div>
          </div>
        )}
      </div>

      <div className='review_item_element'>
        <div className='review_info_item'>
          {review.fileUrls.length === 0 ? (
            <img className='review_img' src={no_image} />
          ) : (
            <img className='review_img' src={review.fileUrls[0]} />
          )}
        </div>
        <div className='review_info_item'>
          <div className='review_rating'>
            <span className='searchresult-ratingStars'>
              {renderStars().map((star, index) => (
                <span key={index}>{star}</span>
              ))}
            </span>
            <div className='review-rating-text'>{review.rating}점</div>
          </div>
          <div className='review_detailReview_container'>
            <div className='review_detailReview'>
              {review.detailReview.substring(0, 84)}
              {review.detailReview.length > 84 ? (
                <span className='detailReview_cut'> ...중략</span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
