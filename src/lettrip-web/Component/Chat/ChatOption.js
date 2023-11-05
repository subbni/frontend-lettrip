import React, { useState, useEffect } from "react";
import moment from "moment"; //날짜 설정하는 라이브러리
import "moment/locale/ko";
import styles from "./Chat.module.css";
import { AiOutlinePicture } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import ChatImageFileForm from "./ChatImageFileForm";
import ChatShedule from "./ChatSchedule";

function ChatOption({
  isOptClicked,
  handleImageFile,
  handleSchedule,
  chatRoomInfo,
}) {
  const [isClicked, setIsClicked] = useState(false);
  const [isScheduleClicked, setIsScheduleClicked] = useState(false);
  const [isPictureClicked, setIsPictureClicked] = useState(false);
  const [isMeetUpScheduled, setIsMeetUpScheduled] = useState(false);

  useEffect(() => {
    onImageFileUpload();
  }, []);

  const handleScheduleClick = (e) => {
    e.preventDefault();
    setIsClicked(true);
    setIsScheduleClicked(true);
    setIsPictureClicked(false); // 사진 전송 관련 상태 초기화
  };

  const handlePictureClick = (e) => {
    e.preventDefault();
    setIsClicked(true);
    setIsPictureClicked(true);
    setIsScheduleClicked(false); // 약속 잡기 관련 상태 초기화
  };

  const onImageFileUpload = (imageUrl) => {
    handleImageFile(imageUrl);
  };

  const onMeetUpScheduled = (MeetUpId) => {
    console.log(MeetUpId);
    handleSchedule(MeetUpId);
    setIsMeetUpScheduled(true);
  };

  return (
    <div className={styles.optContainer}>
      {isOptClicked ? (
        <div className={styles.optBox}>
          {!isClicked ? (
            <div className={styles.optContent}>
              <div className={styles.optSchedule}>
                <p
                  className={styles.calendarBackground}
                  onClick={handleScheduleClick}
                >
                  <FiCalendar className={styles.calendarIcon} />
                </p>
                <p className={styles.calendarText}>약속 잡기</p>
              </div>
              <div className={styles.optPhoto}>
                <p
                  className={styles.pictureBackground}
                  onClick={handlePictureClick}
                >
                  <AiOutlinePicture className={styles.pictureIcon} />
                </p>
                <p className={styles.pictureText}>사진 전송</p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      {isMeetUpScheduled ? (
        <button onClick={() => console.log("약속 취소")}>약속 취소</button>
      ) : null}
      {isScheduleClicked && !isMeetUpScheduled && (
        <div>
          <ChatShedule
            chatRoomInfo={chatRoomInfo}
            onMeetUpScheduled={onMeetUpScheduled}
          />
        </div>
      )}
      {isPictureClicked && (
        <div>
          <h2>사진 전송</h2>
          <ChatImageFileForm onImageFileUpload={onImageFileUpload} />
        </div>
      )}
    </div>
  );
}

export default ChatOption;
