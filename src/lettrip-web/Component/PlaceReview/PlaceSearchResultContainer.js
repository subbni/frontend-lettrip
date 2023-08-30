import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReviewItem from "./ReviewItem";
import styles from "./PlaceReview.module.css";

const PlaceSearchResultContainer = ({ resultReviews }) => {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (resultReviews.length > 0) {
      setMsg(`리뷰 ${resultReviews.length}건`);
    } else {
      setMsg("");
    }
  }, [resultReviews]);
  return (
    <div>
      <div className={styles.review_text}>{msg}</div>
      <div className={styles.review_container}>
        {resultReviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default PlaceSearchResultContainer;
