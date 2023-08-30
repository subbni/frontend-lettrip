import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchMapForm from "./SearchMapForm";
import { RiArrowGoBackLine } from "react-icons/ri";
import { getPlace, getReviewPage } from "../../Service/PlaceReviewService";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import medal from "../../../image/place/verified_Badge.svg.png";

import styles from "./PlaceReview.module.css";

import {
  checkIfLiked,
  deleteLiked,
  pushLiked,
} from "../../Service/LikedService";

const PlaceSearchForm = ({ onGetResults }) => {
  const { id } = useParams();
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
  });
  const [place, setPlace] = useState({
    name: "",
    xpoint: "",
    ypoint: "",
    categoryName: "",
    province: "",
    city: "",
  });
  const likedType = "PLACE_LIKE";
  const [likedForm, setLikedForm] = useState({
    targetId: id,
    likedType: likedType,
  });
  const [liked, setLiked] = useState(false);
  const [totalRating, setTotalRating] = useState(0);
  const [soloFriendlyTotalRating, setSoloFriendlyTotalRating] = useState(1);
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
        console.log(response.content);
        if (response.errorCode) {
        } else {
          setTotalRating(response.totalRating);
          setSoloFriendlyTotalRating(response.soloFriendlyTotalRating);
          setLikedForm({
            ...likedForm,
            targetId: response.id,
          });
          getResult(response.id);
          checkLiked(response.id);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const checkLiked = (id) => {
    checkIfLiked(likedType, id)
      .then((response) => {
        if (response.liked) {
          console.log(response);
          setLiked(true);
        } else {
          console.log(response);
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

  // 좋아요 관리
  const handleLikeClick = () => {
    if (liked) {
      onDeleteLiked();
    } else {
      onPushLiked();
    }
  };

  const onPushLiked = () => {
    pushLiked(likedForm)
      .then((response) => {
        console.log(response);
        if (response.success) {
          setLiked(true);
        }
      })
      .catch((e) => {
        console.log(e);
        alert("좋아요 실패");
      });
  };

  const onDeleteLiked = () => {
    deleteLiked(likedForm)
      .then((response) => {
        console.log(response);
        if (response.success) {
          setLiked(false);
        }
      })
      .catch((e) => {
        console.log(e);
        alert("좋아요 취소 실패");
      });
  };

  const onReSearchBtnClick = () => {
    setIsPlaceSelected(false);
    window.location.reload();
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

    const filledStar = <FaStar className={styles.star} />;
    const halfStar = <FaStarHalfAlt className={styles.star} />;
    const emptyStar = <FaRegStar className={styles.star} />;

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
      <div className={styles.place_searchForm}>
        {isPlaceSelected ? (
          <div className={styles.place_searchForm_box}>
            <div className={styles.returnBtn}>
              <RiArrowGoBackLine onClick={onReSearchBtnClick} />
            </div>
            {totalSoloRating >= 0.5 && (
              <div className={styles.place_medal}>
                <img className={styles.medal} src={medal} />
                <p className={styles.place_medal_txt}>
                  과반수가 혼자 가기 추천한 여행지
                </p>
              </div>
            )}
            <div className={styles.place_name}>
              {place.name}
              {liked ? (
                <AiFillHeart
                  className={styles.place_likedBtn}
                  onClick={handleLikeClick}
                />
              ) : (
                <AiOutlineHeart
                  className={styles.place_likedBtn}
                  onClick={handleLikeClick}
                />
              )}
            </div>

            <div className={styles.place_category}>{place.categoryName}</div>

            <div className={styles.place_rating}>
              <span className={styles.place_ratingStars}>
                {renderStars().map((star, index) => (
                  <span key={index}>{star}</span>
                ))}
              </span>
              <span className={styles.place_starScore}>
                {totalRating.toFixed(1)}
              </span>
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
