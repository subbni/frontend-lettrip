import React, { useState, useEffect } from "react";
import { showUserMeetUpReview } from "../../../Service/MeetUpReivewService";
import styles from "../MyPage.module.css";
import anonymous_profile from "../../../../image/lettrip_anonymous_profile.png"; //프로필 이미지

const UserMeetUpReview = ({ UserId }) => {
  console.log(UserId);
  const [CompletedPageForm, setCompletedPageForm] = useState({
    meetUpStatus: "COMPLETED",
    page: 0,
    size: 6,
    sort: "id,ASC",
  });
  const [CanceledpageForm, setCanceledPageForm] = useState({
    meetUpStatus: "CANCELLED",
    page: 0,
    size: 6,
    sort: "id,ASC",
  });
  const [completedreview, setCompletedReview] = useState([]);
  const [canceledreview, setCanceledReview] = useState([]);

  useEffect(() => {
    fetchCompletedReview();
    fetchCanceledReview();
  }, []);

  // 한줄평 불러오기 -> completed
  const fetchCompletedReview = () => {
    showUserMeetUpReview(UserId, CompletedPageForm)
      .then((response) => {
        console.log(response.content);
        setCompletedReview(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
      });
  };

  // 한줄평 불러오기 -> canceled
  const fetchCanceledReview = () => {
    showUserMeetUpReview(UserId, CanceledpageForm)
      .then((response) => {
        console.log(response.content);
        setCanceledReview(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
      });
  };

  return (
    <div className={styles.meetUpReviewContainer}>
      <div className={styles.completedContainer}>
        <h3 className={styles.completedText}> 매칭 성공 한줄평</h3>
        {completedreview ? (
          completedreview.map((review, index) => (
            <div key={index} className={styles.meetUpReviewBox}>
              <div className={styles.meetUpReivewHeader}>
                <img
                  className={styles.meetUpReviewImg}
                  src={review.imageUrl || anonymous_profile}
                  alt='User Profile'
                />
                <span className={styles.meetUpReviewNickname}>
                  {review.userProfile.nickname}
                </span>
              </div>
              <p className={styles.meetUpReviewContent}>{review.content}</p>
            </div>
          ))
        ) : (
          <div className={styles.travelPlanInfo}>
            아직 작성된 한줄평이 없습니다.
          </div>
        )}
      </div>
      <div className={styles.canceledContainer}>
        <h3 className={styles.canceledText}> 매칭 파토 한줄평</h3>
        {canceledreview ? (
          canceledreview.map((review, index) => (
            <div key={index} className={styles.meetUpReviewBox}>
              <div className={styles.meetUpReivewHeader}>
                <img
                  className={styles.meetUpReviewImg}
                  src={review.imageUrl || anonymous_profile}
                  alt='User Profile'
                />
                <span className={styles.meetUpReviewNickname}>
                  {review.userProfile.nickname}
                </span>
              </div>
              <p className={styles.meetUpReviewContent}>{review.content}</p>
            </div>
          ))
        ) : (
          <div className={styles.travelPlanInfo}>
            아직 작성된 한줄평이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMeetUpReview;
