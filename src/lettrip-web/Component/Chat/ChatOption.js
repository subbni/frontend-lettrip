import React, { useState, useEffect } from "react";
import moment from "moment"; //날짜 설정하는 라이브러리
import "moment/locale/ko";
import styles from "./Chat.module.css";
import { AiOutlinePicture, AiOutlineClockCircle } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import ChatImageFileForm from "./ChatImageFileForm";

function ChatOption({ isOptClicked, handleImageFile }) {
  const [isClicked, setIsClicked] = useState(false);
  const [isScheduleClicked, setIsScheduleClicked] = useState(false);
  const [isPictureClicked, setIsPictureClicked] = useState(false);

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
      {isScheduleClicked && (
        <div className={styles.scheduleBox}>
          <h3 className={styles.scheduleTitle}>약속 잡기</h3>
          <div className={styles.scheduleOptBox}>
            <AiOutlineClockCircle className={styles.clockIcon} />
            <p className={styles.dateOpt}>2023.11.02</p>
            <p className={styles.timeOpt}>오후 1:33</p>
            <button className={styles.scheduleBtn}> 약속 등록</button>
          </div>
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
