import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTravel } from "../../Service/MyPageService";
import Moment from "moment"; //날짜 및 시간 표시 라이브러리

import styles from "./MeetUp.module.css";
import { RxCross2 } from "react-icons/rx";

function MeetUpPlan({ onPlanSelect, onConfirm }) {
  const navigate = useNavigate();
  const [planList, setPlanList] = useState([]);
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
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

  //계획 연동
  const handlePlanClick = (travelId, planTitle) => {
    const confirmMessage = `${planTitle} 계획을 연동하시겠습니까? `;
    if (window.confirm(confirmMessage)) {
      onConfirm();
      onPlanSelect(planTitle, travelId);
    }
    console.log(travelId);
  };

  //금액 단위 설정 (예시 : 10,000원 )
  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div>
      <button
        className={styles.planCloseBtn}
        onClick={() => navigate("/friend")}
      >
        <RxCross2 />
      </button>
      <h2 className={styles.planText}>연동할 계획을 선택해주세요.</h2>
      {planList ? (
        <div className={styles.planContainer}>
          {planList.map((travel) => (
            <div
              key={travel.id}
              className={styles.planItem}
              onClick={() => handlePlanClick(travel.id, travel.title)}
            >
              <h1 className={styles.planTitle}>{travel.title}</h1>
              <p className={styles.planDate}>
                {Moment(travel.departDate).format("YY.MM.DD")} ~
                {Moment(travel.lastDate).format("YY.MM.DD")}
              </p>
              <p className={styles.planNumOfCourses}>
                {travel.numberOfCourses}개
              </p>
              <p className={styles.planTheme}>#{travel.travelTheme}</p>
              <p className={styles.planTotalCost}>
                {numberWithCommas(travel.totalCost)}원 / 인
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div> 아직 등록된 여행 플랜이 없습니다.</div>
      )}
    </div>
  );
}

export default MeetUpPlan;
