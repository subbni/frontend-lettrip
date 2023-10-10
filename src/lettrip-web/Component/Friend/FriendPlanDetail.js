import React from "react";
import styles from "./Detail.module.css";

function FriendPlanDetail({ writer }) {
  return (
    <div className={styles.planContainer}>
      <div className={styles.planHeader}>
        {writer}님의 여행 계획이 궁금하세요? 플랜을 클릭해 확인해보세요.
      </div>
      <hr className={styles.hr2} />
      <div className={styles.planBox}>
        <div className={styles.boxContent}>
          <p className={styles.boxLabel01}> 제목 </p>
          <p className={styles.boxLabel02}> 23.10.10. ~ 23.10.10 </p>
          <p className={styles.boxLabel03}> 코스 수 </p>
          <p className={styles.boxLabel03}> 테마 </p>
          <p className={styles.boxLabel03}> 금액 </p>
        </div>
        <button className={styles.boxBtn}> 플랜확인 </button>
      </div>
    </div>
  );
}

export default FriendPlanDetail;
