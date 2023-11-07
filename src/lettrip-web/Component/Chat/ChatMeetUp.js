import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/ko";
import {
  sendMeetUpCode, // 인증 번호를 요청하는 함수
  verifyMeetUp, // 인증 번호를 확인하는 함수
} from "../../Service/MeetUpService";
import { createMeetUpReview } from "../../Service/MeetUpReivewService";
import styles from "./Chatting.module.css";

function ChatMeetUp({ enterChatRoom, post, meetUp }) {
  console.log(enterChatRoom, post);
  const [isRequestId, setIsRequestId] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const [verifyForm, setVerifyForm] = useState({
    code: "", // 인증 번호를 저장하는 프로퍼티
    meetUpId: meetUp.id,
  });

  useEffect(() => {
    if (post && enterChatRoom) {
      setIsRequestId(post.userProfile.id === enterChatRoom.currentUserId);
    } else {
      setIsRequestId(false); // post 또는 enterChatRoom가 없는 경우에는 false로 설정
    }
  }, []);

  const onCodeInputChange = (event) => {
    const { value } = event.target;
    setVerifyForm({
      ...verifyForm,
      code: value, // 사용자 입력을 verifyForm.code에 업데이트
    });
  };

  const onSendMeetUpCode = (e) => {
    e.preventDefault();
    sendMeetUpCode(meetUp.id)
      .then((response) => {
        console.log(response);
        setVerificationCode(response.code);
        alert("인증 번호를 요청했습니다. 메시지를 확인해주세요.");
      })
      .catch((error) => {
        console.error("인증 번호 요청을 보내지 못했습니다.", error);
      });
  };

  const onSubmitMeetUpCode = (e) => {
    e.preventDefault();
    verifyMeetUp(verifyForm)
      .then((response) => {
        console.log(response);
        console.log(verifyForm);
      })
      .catch((error) => {
        console.error("인증 번호를 확인하지 못했습니다.", error);
      });
  };

  return (
    <div className={styles.meetUpContainer}>
      {!isRequestId ? (
        <div>
          <h3>인증번호 확인</h3>
          <div className={styles.verification}>
            <span className={styles.verificationText}>
              매칭 인증번호 입니다.
            </span>
            <span className={styles.verificationText}>
              상대방이 인증창에 입력하면 매칭이 완료됩니다.
            </span>
            <span className={styles.verificationCode}>{verificationCode}</span>
            <button
              className={styles.verificationBtn}
              onClick={onSendMeetUpCode}
            >
              인증번호 요청하기
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3>인증번호 입력</h3>
          <div className={styles.verification}>
            <span className={styles.verificationText}>
              매칭 상대 화면의 인증번호를 입력해주세요.
            </span>
            <span className={styles.verificationText}>
              인증번호를 확인하면 매칭이 완료됩니다.
            </span>
            <input
              className={styles.verificationCodeInput}
              type='text'
              placeholder='인증번호를 입력하세요.'
              value={verifyForm.code}
              onChange={onCodeInputChange}
            />
            <button
              className={styles.verificationBtn}
              onClick={onSubmitMeetUpCode}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatMeetUp;
