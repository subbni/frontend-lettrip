import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostDetail.module.css";

function PostTravelDetail({ writer }) {
  const navigate = useNavigate();
  const handleCheckPlan = (e) => {
    e.preventDefault();
    console.log("계획확인 누르기 (travel 페이지로 이동하기");
    navigate("/travel");
  };

  return (
    <div className={styles.planDetailContainer}>
      <div className={styles.planDetailHeader}>
        {writer}님의 여행 계획이 궁금하세요? 플랜을 클릭해 확인해보세요.
      </div>
      <hr className={styles.hr2} />
      <div className={styles.planDetailBox}>
        <div className={styles.boxContent}>
          <p className={styles.planTitle}> 제목 </p>
          <p className={styles.planDate}> 23.10.10. ~ 23.10.10 </p>
          <p className={styles.planCourse}> 코스 수 </p>
          <p className={styles.planTheme}> 테마 </p>
          <p className={styles.planCost}> 금액 </p>
        </div>
        <button className={styles.planCheckBtn} onClick={handleCheckPlan}>
          {" "}
          플랜확인{" "}
        </button>
      </div>
    </div>
  );
}

export default PostTravelDetail;
