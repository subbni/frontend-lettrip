import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserTravel } from "../../../Service/UserMyPageService";
import Moment from "moment"; //날짜 및 시간 표시 라이브러리
import styles from "../MyPage.module.css";
import no_image from "../../../../image/travel/no_image.png";

const UserTravelReview = ({ UserId }) => {
  const navigate = useNavigate();
  const [reviewList, setReviewList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,DESC",
  });

  useEffect(() => {
    getUserTravel(UserId, true, pageForm)
      .then((response) => {
        setReviewList(response.content);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, []);

  const handleReviewClick = (reviewId) => {
    navigate(`/travel/course/review/${reviewId}`);
  };

  //금액 단위 설정 (예시 : 10,000원 )
  const numberWithCommas = (number) => {
    if (number === undefined) {
      number = 0;
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={styles.travelReviewContainer}>
      {reviewList ? (
        reviewList.map((travel, index) => (
          <div
            key={index}
            className={styles.travelReviewItem}
            onClick={() => handleReviewClick(travel.id)}
          >
            <p className={styles.travelReviewDate}>
              {Moment(travel.departDate).format("YY.MM.DD")} ~
              {Moment(travel.lastDate).format("YY.MM.DD")}
            </p>
            <img
              className={styles.mainImage}
              src={travel.mainImageUrl ? travel.mainImageUrl : no_image}
              alt='Main Image'
            />
            <div className={styles.travelReviewHeader}>
              <div className={styles.travelReviewTitle}>{travel.title}</div>
              <div className={styles.travelReviewPlace}>
                <div className={styles.travelReviewCity}>
                  {travel.city}
                  <span className={styles.travelReviewProvince}>
                    {travel.province}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.travelReviewBox}>
              <div>{travel.numberOfCourses}개</div>
              <div>#{travel.travelTheme}</div>
              <div>{numberWithCommas(travel.totalCost)}원 / 인</div>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.travelReviewInfo}>
          아직 등록된 여행 기록이 없습니다.
        </div>
      )}
    </div>
  );
};

export default UserTravelReview;
