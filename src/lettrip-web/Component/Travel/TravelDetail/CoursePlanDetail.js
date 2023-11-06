import React, { useEffect, useState } from "react";

import styles from "./TravelPlan.module.css";

const CoursePlanDetail = ({ course }) => {
  useEffect(() => {
    console.log(course);
  }, []);

  //시차 설정하기
  const getKoreanTime = (dateString) => {
    const options = {
      timeZone: "Asia/Seoul",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const koreanTime = new Date(dateString).toLocaleTimeString(
      "ko-KR",
      options
    );
    return koreanTime;
  };

  //금액 단위 설정
  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailHeader}>
        <div className={styles.detailTitle}>{course.place.name}</div>
        <div className={styles.detailTime}>
          {getKoreanTime(course.arrivedTime)}
        </div>
      </div>
      <div className={styles.detailAddress}>
        {course.place.province} {course.place.city}
      </div>
      <div className={styles.detailCost}>
        예상 금액 : {numberWithCommas(course.cost)}원
      </div>
    </div>
  );
};

export default CoursePlanDetail;
