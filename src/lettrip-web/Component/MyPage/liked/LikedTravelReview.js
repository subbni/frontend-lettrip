import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyLikedTravel } from "../../../Service/MyPageService";
import Moment from "moment"; //날짜 및 시간 표시 라이브러리
import styles from "../MyPage.module.css";
import no_image from "../../../../image/travel/no_image.png";
import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png"; //프로필 이미지

const LikedTravelReview = () => {
  const navigate = useNavigate();
  const [travelList, setTravelList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,DESC",
  });

  useEffect(() => {
    getMyLikedTravel(pageForm)
      .then((response) => {
        console.log(response.content);
        setTravelList(response.content);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, []);

  const handleReviewClick = (reviewId) => {
    navigate(`/travel/course/reivew/${reviewId}`);
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
      {travelList.length > 0 ? (
        travelList.map((travel, index) => (
          <div
            key={index}
            className={styles.travelReviewItem}
            onClick={() => handleReviewClick(travel.id)}
          >
            <div className={styles.travelReviewProfile}>
              <img
                className={styles.travelReviewWriterImage}
                src={
                  travel.writerImageUrl
                    ? travel.writerImageUrl
                    : anonymous_profile
                }
                alt='Writer Image'
              />

              <p className={styles.travelReviewNickname}>
                {travel.writerNickname}
              </p>
              <p className={styles.travelReviewLikedDate}>
                {Moment(travel.departDate).format("YY.MM.DD")} ~
                {Moment(travel.lastDate).format("YY.MM.DD")}
              </p>
            </div>
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

export default LikedTravelReview;
