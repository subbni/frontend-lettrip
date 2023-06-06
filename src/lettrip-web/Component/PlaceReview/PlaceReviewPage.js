import { useState } from "react";
import "./PlaceReview.css";
import PlaceSearchForm from "./PlaceSearchForm";
import PlaceSearchResultContainer from "./PlaceSearchResultContainer";

const PlaceReviewPage = () => {
  const [resultReviews, setResultReviews] = useState([]);
  const onGetResults = (resultList) => {
    setResultReviews(resultList);
  };

  return (
    <div className='place_review_page'>
      <h1 className='place_review_title'>장소 검색</h1>
      <PlaceSearchForm onGetResults={onGetResults} />
      <PlaceSearchResultContainer resultReviews={resultReviews} />
    </div>
  );
};

export default PlaceReviewPage;
