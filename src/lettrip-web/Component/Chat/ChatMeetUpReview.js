import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/ko";
import { createMeetUpReview } from "../../Service/MeetUpReivewService";
import styles from "./Chatting.module.css";

function ChatMeetUpReview({ chatParticipant, meetUp, onReviewSuccess }) {
  const [reviewForm, setReviewForm] = useState({
    meetUpId: meetUp.id,
    objectUserId: chatParticipant.id,
    content: "",
  });

  const onCodeInputChange = (event) => {
    const { value } = event.target;
    setReviewForm({
      ...reviewForm,
      content: value, // 사용자 입력을 verifyForm.code에 업데이트
    });
  };

  const onSubmitMeetUpCode = (e) => {
    e.preventDefault();
    createMeetUpReview(reviewForm)
      .then((response) => {
        console.log(response);
        console.log(reviewForm);
        alert("한줄평 작성이 완료되었습니다. 마이페이지에서 확인하세요!");
        onReviewSuccess(response.success);
      })
      .catch((error) => {
        console.error("한줄평 남기기에 실패했습니다.", error);
      });
  };

  return (
    <div className={styles.meetUpContainer}>
      <h3>한줄평 남기기</h3>
      <div className={styles.verification}>
        <span className={styles.verificationText}>만남은 어떠셨나요?</span>
        <span className={styles.verificationText}>
          상대방에 대한 한줄평을 작성해주세요.
        </span>

        <input
          className={styles.verificationCodeInput}
          type='text'
          placeholder='한줄평을 작성하세요.'
          value={reviewForm.content}
          onChange={onCodeInputChange}
        />
        <button className={styles.verificationBtn} onClick={onSubmitMeetUpCode}>
          확인
        </button>
      </div>
    </div>
  );
}

export default ChatMeetUpReview;
