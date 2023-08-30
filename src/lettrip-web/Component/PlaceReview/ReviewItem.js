import no_image from "../../../image/travel/no_image.png";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지

import styles from "./PlaceReview.module.css";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { BsCheck2Circle } from "react-icons/bs";

const ReviewItem = ({ review }) => {
  // 별점 관리
  const renderStars = () => {
    const rating = review.rating;

    const filledStar = <FaStar className={styles.big_star} />;
    const halfStar = <FaStarHalfAlt className={styles.big_star} />;
    const emptyStar = <FaRegStar className={styles.big_star} />;

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
    <div className={styles.review_box}>
      <div className={styles.review_item_header}>
        <div className={styles.review_writerInfo}>
          {review.writerImageUrl === null ? (
            <img
              className={styles.review_writerImage}
              src={anonymous_profile}
            />
          ) : (
            <img
              className={styles.review_writerImage}
              src={review.writerImageUrl}
            />
          )}
          <div className={styles.review_writerNickname}>
            {review.writerNickname}
          </div>
          <div className={styles.review_visitTimes}>
            {review.visitTimes}번째 방문
          </div>
          {soloRating === 1 && (
            <div className={styles.review_medal}>
              <span>
                <BsCheck2Circle />
              </span>

              <div className={styles.review_recommend}>혼자 가기 추천</div>
            </div>
          )}
        </div>
        <div></div>

        <div className={styles.review_item_content}>
          <div className={styles.review_image}>
            {review.fileUrls.length === 0 ? (
              <img className={styles.review_img} src={no_image} />
            ) : (
              <img className={styles.review_img} src={review.fileUrls[0]} />
            )}
          </div>
          <div className={styles.review_content}>
            <div className={styles.review_ratingStars}>
              <span className={styles.stars}>
                {renderStars().map((star, index) => (
                  <span key={index}>{star}</span>
                ))}
              </span>
              <div className={styles.review_starScore}>
                {review.rating.toFixed(1)}
              </div>
            </div>
            <div className={styles.review_detailReview}>
              <div className={styles.review_detailContent}>
                {review.detailReview.substring(0, 84)}
                {review.detailReview.length > 84 ? (
                  <span className='detailReview_cut'> ...중략</span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
