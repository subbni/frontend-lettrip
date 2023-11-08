import React, { useState, useEffect } from "react";
import { cancelMeetUp } from "../../Service/MeetUpService";
import styles from "./Chat.module.css";
import { AiOutlinePicture } from "react-icons/ai";
import { LuCalendar, LuCalendarX2 } from "react-icons/lu";
import ChatImageFileForm from "./ChatImageFileForm";
import ChatShedule from "./ChatSchedule";

function ChatOption({
  isOptClicked,
  handleImageFile,
  onMeetUpScheduled,
  enterChatRoom,
}) {
  const [isClicked, setIsClicked] = useState(false);
  const [isScheduleClicked, setIsScheduleClicked] = useState(false);
  const [isPictureClicked, setIsPictureClicked] = useState(false);
  const [meetUpId, setMeetUpId] = useState(null);
  const [isMeetUpScheduled, setIsMeetUpScheduled] = useState(false);
  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    onImageFileUpload();
    onMeetUpId();
  }, []);

  useEffect(() => {
    if (enterChatRoom && enterChatRoom.meetUpId !== null) {
      setIsMeetUpScheduled(true);
      setMeetUpId(enterChatRoom.meetUpId);
      if (enterChatRoom.meetUpStatus === "CANCELED") {
        setCanceled(true);
      }
    } else {
      setIsMeetUpScheduled(false);
    }
  }, [enterChatRoom]);

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

  const onMeetUpId = (meetUpId) => {
    setMeetUpId(meetUpId);
    onMeetUpScheduled(meetUpId);
    setIsMeetUpScheduled(true);
    setIsClicked(false);
  };

  const ondeleteMeetUp = (meetUpId) => {
    console.log(isMeetUpScheduled);
    const shouldCancel = window.confirm("만남을 취소하시겠습니까?");
    if (shouldCancel) {
      // 사용자가 확인을 누르면 취소 요청을 보냄
      cancelMeetUp(meetUpId)
        .then((response) => {
          console.log(response);
          // 취소된 약속인 경우 메시지 표시
          if (canceled === true) {
            window.alert("이미 취소된 약속입니다.");
          }
        })
        .catch((error) => {
          console.error("만남을 취소하지 못했습니다.", error);
        });
    }
  };

  return (
    <div className={styles.optContainer}>
      {isOptClicked ? (
        <div className={styles.optBox}>
          {!isClicked ? (
            <div className={styles.optContent}>
              {isMeetUpScheduled ? (
                <div className={styles.optSchedule}>
                  <p
                    className={styles.calendarBackground}
                    onClick={() => ondeleteMeetUp(meetUpId)}
                  >
                    <LuCalendarX2 className={styles.calendarIcon} />
                  </p>
                  <p className={styles.calendarText}>약속 취소</p>
                </div>
              ) : (
                <div className={styles.optSchedule}>
                  <p
                    className={styles.calendarBackground}
                    onClick={handleScheduleClick}
                  >
                    <LuCalendar className={styles.calendarIcon} />
                  </p>
                  <p className={styles.calendarText}>약속 잡기</p>
                </div>
              )}
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
      {isScheduleClicked && !isMeetUpScheduled && (
        <ChatShedule enterChatRoom={enterChatRoom} onMeetUpId={onMeetUpId} />
      )}
      {isPictureClicked && (
        <ChatImageFileForm onImageFileUpload={onImageFileUpload} />
      )}
    </div>
  );
}

export default ChatOption;
