import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTravelDetail } from "../../Service/TravelService";
import Moment from "moment"; //날짜 및 시간 표시 라이브러리

import styles from "./PostDetail.module.css";

function PostTravelDetail({ writer, travelId }) {
  const navigate = useNavigate();
  const [travel, setTravel] = useState({
    writerNickname: "",
    writerEmail: "",
    title: "",
    travelTheme: "",
    province: "",
    departDate: "",
    lastDate: "",
    totalCost: "",
    numberOfCourses: "",
    courses: [],
  });

  useEffect(() => {
    getTravelDetail(travelId)
      .then((response) => {
        console.log(response);
        setTravel(response);
        console.log(travel);
      })
      .catch((e) => {
        window.alert("오류가 발생했습니다.");
        console.log(e);
      });
  }, []);

  const handleCheckPlan = (e) => {
    e.preventDefault();
    console.log("계획확인 누르기 (travel 페이지로 이동하기");
    navigate(`/travel/course/plan/${travelId}`);
  };

  //금액 단위 설정 (예시 : 10,000원 )
  const numberWithCommas = (number) => {
    if (number === undefined) {
      number = 0;
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={styles.planDetailContainer}>
      {travel.title ? (
        <div>
          <div className={styles.planDetailHeader}>
            {writer}님의 여행 계획이 궁금하세요? 플랜을 클릭해 확인해보세요.
          </div>
          <hr className={styles.hr2} />
          <div className={styles.planDetailBox}>
            <div className={styles.boxContent}>
              <p className={styles.planTitle}> {travel.title} </p>
              <p className={styles.planDate}>
                {Moment(travel.departDate).format("YY.MM.DD")} ~
                {Moment(travel.lastDate).format("YY.MM.DD")}
              </p>
              <p className={styles.planCourse}> {travel.numberOfCourses}개</p>
              <p className={styles.planTheme}> #{travel.travelTheme} </p>
              <p className={styles.planCost}>
                {numberWithCommas(travel.totalCost)}원 / 인
              </p>
            </div>
            <button className={styles.planCheckBtn} onClick={handleCheckPlan}>
              플랜확인
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.planDetailHeader}>
          {writer}님의 여행 계획은 아직 없어요.
        </div>
      )}
    </div>
  );
}

export default PostTravelDetail;
