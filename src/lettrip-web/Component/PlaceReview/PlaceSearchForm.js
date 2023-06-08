import { useEffect, useState } from "react";
import SearchMapForm from "./SearchMapForm";
import { RiArrowGoBackLine } from "react-icons/ri";
import { getPlace, getReviewPage } from "../../Service/PlaceReviewService";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import medal from "../../../image/place/verified_Badge.svg.png";

import "./PlaceReview.css";

const PlaceSearchForm = ({ onGetResults }) => {
  const [place, setPlace] = useState({
    name: "",
    xpoint: "",
    ypoint: "",
    categoryName: "",
    province: "",
    city: "",
  });
  const [totalRating, setTotalRating] = useState(-1);
  const [soloFriendlyTotalRating, setSoloFriendlyTotalRating] = useState(1);

  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);

  useEffect(() => {
    if (place.xpoint.trim()) {
      checkPlace();
    }
  }, [place]);

  const onPlaceSelect = (selectedPlace) => {
    setPlace(selectedPlace);
    setIsPlaceSelected(true);
  };

  const checkPlace = () => {
    console.log(place);
    getPlace(place.xpoint, place.ypoint)
      .then((response) => {
        console.log(response);
        setSoloFriendlyTotalRating(response.soloFriendlyTotalRating);
        if (response.errorCode) {
        } else {
          setTotalRating(response.totalRating);
          getResult(response.id);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getResult = (placeId) => {
    getReviewPage(placeId, pageForm)
      .then((response) => {
        console.log(response);
        onGetResults(response.content);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onReSearchBtnClick = () => {
    setIsPlaceSelected(false);
    setPlace({
      name: "",
      xpoint: "",
      ypoint: "",
      categoryName: "",
      province: "",
      city: "",
    });
  };

  // 별점 관리
  const renderStars = () => {
    const rating = totalRating;

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
  const totalSoloRating = soloFriendlyTotalRating;

  return (
    <div>
      <div className='place_searchForm'>
        {isPlaceSelected ? (
          <div>
            <div className='place_name'>{place.name}</div>
            {totalSoloRating >= 0.5 && (
              <div className='place-medal'>
                <img className='place-medal-image' src={medal} />
                <p className='recommend-place-solo-travel'>
                  과반수가 혼자 가기 추천한 여행지
                </p>
              </div>
            )}
            <div className='place_category'>{place.categoryName}</div>

            <div className='place_rating'>
              <span className='place-ratingStars'>
                {renderStars().map((star, index) => (
                  <span key={index}>{star}</span>
                ))}
              </span>
              {totalRating}점
            </div>

            <div className='place_research_btn'>
              <RiArrowGoBackLine onClick={onReSearchBtnClick} />
              <span className='place_research_msg'>다시 검색</span>
            </div>
          </div>
        ) : (
          <SearchMapForm onPlaceSelect={onPlaceSelect} />
        )}
      </div>
    </div>
  );
};

export default PlaceSearchForm;
