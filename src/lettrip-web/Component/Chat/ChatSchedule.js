import React, { useState } from "react";
import moment from "moment"; // 날짜 설정하는 라이브러리
import "moment/locale/ko";
import { createMeetUp } from "../../Service/MeetUpService";
import styles from "./Chat.module.css";
import { AiOutlineClockCircle } from "react-icons/ai";

function ChatShedule({ enterChatRoom, onMeetUpId }) {
  const [meetUpForm, setMeetUpForm] = useState({
    roomId: enterChatRoom.roomId,
    meetUpPostId: enterChatRoom.meetUpPostId,
    participantId: enterChatRoom.participant.id,
    meetUpDate: "",
  });
  const [date, setDate] = useState({
    meetUpDate: "",
    meetUpTime: "",
  });

  // 날짜와 시간을 변경하는 함수
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setMeetUpForm({ ...meetUpForm, meetUpDate: newDate });
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setDate({ ...date, meetUpTime: newTime });
  };

  // 약속 등록 버튼을 눌렀을 때 실행되는 함수
  const handleScheduleSubmit = (e) => {
    console.log(meetUpForm);
    e.preventDefault();
    //시간 합치기
    /*const meetUpDateTime = `${date.meetUpDate} ${date.meetUpTime}`;
    const formattedMeetUpDate = moment(
      meetUpDateTime,
      "YYYY-MM-DD HH:mm"
    ).format("YYYY-MM-DD HH:mm:ss");
    setMeetUpForm({ ...meetUpForm, meetUpDate: formattedMeetUpDate });
    console.log(formattedMeetUpDate); */
    if (window.confirm("만남을 약속하시겠습니까?")) {
      createMeetUp(meetUpForm)
        .then((response) => {
          onMeetUpId(response.data);
          console.log(response);
          window.alert("만남이 등록되었습니다.");
        })
        .catch((e) => {
          console.log(e);
          window.alert("만남 등록에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  return (
    <div className={styles.scheduleBox}>
      <h3 className={styles.scheduleTitle}>약속 잡기</h3>
      <div className={styles.scheduleOptBox}>
        <AiOutlineClockCircle className={styles.clockIcon} />
        <input
          type='date'
          className={styles.dateOpt}
          value={meetUpForm.meetUpDate}
          onChange={handleDateChange}
        />
        {/*
        <input
          type='time'
          className={styles.timeOpt}
          value={date.meetUpTime}
          onChange={handleTimeChange}
        />*/}
        <button className={styles.scheduleBtn} onClick={handleScheduleSubmit}>
          약속 등록
        </button>
      </div>
    </div>
  );
}

export default ChatShedule;
