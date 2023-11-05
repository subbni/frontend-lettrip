import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/ko";
import {
  showMeetUpPost,
  cancelMeetUp,
  sendMeetUpCode, // 인증 번호를 요청하는 함수
  verifyMeetUp, // 인증 번호를 확인하는 함수
} from "../../Service/MeetUpService";
import styles from "./Chat.module.css";

function ChatHeaderOpt({ meetUpId, enterChatRoom }) {
  console.log(meetUpId);
  console.log(enterChatRoom);
  const [meetUp, setMeetUp] = useState(null); // 약속 정보 상태
  const [showMeetUpList, setShowMeetUpList] = useState(false); // 약속 목록을 보여줄지 여부를 나타내는 상태
  const [verificationRequested, setVerificationRequested] = useState(false); // 인증 번호 요청 여부를 나타내는 상태
  const [verificationCode, setVerificationCode] = useState(""); // 사용자가 입력한 인증 번호 상태
  const [verificationResult, setVerificationResult] = useState(""); // 인증 결과 상태
  const [verifyForm, setVerifyForm] = useState({
    code: "", // 인증 번호를 저장하는 프로퍼티
    meetUpId: "1",
  });

  // 여기에서 약속 정보를 가져오는 비동기 함수를 호출
  useEffect(() => {
    if (showMeetUpList) {
      fetchMeetUp(); // 약속 정보를 불러오는 함수 호출
    }
  }, [showMeetUpList]);

  const showMeetUps = () => {
    setShowMeetUpList(!showMeetUpList); // "만남" 버튼을 다시 누를 때 약속 목록을 토글
  };

  const cancelMeetUps = () => {
    const shouldCancel = window.confirm("만남을 취소하시겠습니까?");
    if (shouldCancel) {
      // 사용자가 확인을 누르면 취소 요청을 보냄
      cancelMeetUp(meetUpId)
        .then((response) => {
          setMeetUp(response.content);
          console.log(response);
        })
        .catch((error) => {
          console.error("만남을 취소하지 못했습니다.", error);
        });
    }
  };

  const verifyMeetUps = () => {
    if (verificationRequested) {
      // 이미 인증 번호를 요청한 경우
      if (verificationCode) {
        setVerifyForm({
          ...verifyForm,
          code: verificationCode,
        });
        verifyMeetUp(verifyForm)
          .then((response) => {
            console.log(response);
            setVerificationResult(response.result);
            console.log(verifyForm);
          })
          .catch((error) => {
            console.error("인증 번호를 확인하지 못했습니다.", error);
          });
      } else {
        alert("인증 번호를 입력해주세요.");
      }
    } else {
      sendMeetUpCode(meetUpId)
        .then((response) => {
          console.log(response);
          alert("인증 번호를 요청했습니다. 메시지를 확인해주세요.");
          setVerificationRequested(true);
        })
        .catch((error) => {
          console.error("인증 번호 요청을 보내지 못했습니다.", error);
        });
    }
  };

  const fetchMeetUp = () => {
    showMeetUpPost(meetUpId)
      .then((response) => {
        setMeetUp(response.content);
        console.log(response);
      })
      .catch((error) => {
        console.error("만남을 불러오지 못했습니다.", error);
      });
  };

  return (
    <div>
      <button onClick={showMeetUps}>만남</button>
      <button onClick={cancelMeetUps}>만남 취소</button>
      <button onClick={verifyMeetUps}>인증하기</button>
      <input
        type='text'
        placeholder='인증 번호 입력'
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <p>{verificationResult}</p>
      {showMeetUpList && meetUp && (
        <div className={styles.meetUpList}>
          <h2>등록된 만남</h2>
          <ul>
            <li>{moment(meetUp.meetUpDate).format("YYYY년 MM월 DD일")}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default ChatHeaderOpt;
