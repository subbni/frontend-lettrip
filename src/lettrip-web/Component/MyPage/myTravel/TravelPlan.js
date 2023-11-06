import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTravel } from "../../../Service/MyPageService";
import Moment from "moment"; //날짜 및 시간 표시 라이브러리
import styles from "../MyPage.module.css";

const TravelPlan = () => {
  const navigate = useNavigate();
  const [planList, setPlanList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 9,
    sort: "id,DESC",
  });

  useEffect(() => {
    getMyTravel(false, pageForm)
      .then((response) => {
        setPlanList(response.content);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        alert("오류 발생");
      });
  }, [pageForm]);

  const handlePlanClick = (planId) => {
    navigate(`/travel/course/plan/${planId}`);
  };

  //금액 단위 설정 (예시 : 10,000원 )
  const numberWithCommas = (number) => {
    if (number === undefined) {
      number = 0;
    }
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={styles.travelPlanContainer}>
      {planList.length > 0 ? (
        planList.map((plan, index) => (
          <div
            key={index}
            className={styles.travelPlanItem}
            onClick={() => handlePlanClick(plan.id)}
          >
            <p className={styles.travelPlanTitle}>{plan.title}</p>
            <p className={styles.travelPlanDate}>
              {Moment(plan.departDate).format("YY.MM.DD")} ~
              {Moment(plan.lastDate).format("YY.MM.DD")}
            </p>
            <p className={styles.travelPlanCourse}>{plan.numberOfCourses}개</p>
            <p className={styles.travelPlanTheme}> #{plan.travelTheme} </p>
            <p className={styles.travelPlanCost}>
              {numberWithCommas(plan.totalCost)}원 / 인
            </p>
          </div>
        ))
      ) : (
        <div className={styles.travelPlanInfo}>
          아직 등록된 여행 플랜이 없습니다.
        </div>
      )}
    </div>
  );
};

export default TravelPlan;
