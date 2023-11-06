import React, { useState, useEffect } from "react";
import moment from "moment"; //날짜 설정하는 라이브러리
import "moment/locale/ko";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import styles from "./Chatting.module.css";

function ChatList({ chatRooms, onClickChatRoom }) {
  const [chatParticipant, setChatParticipant] = useState([]); //해당 채팅방 상대 정보
  useEffect(() => {
    console.log(chatRooms);
  }, []);

  //해당 채팅방 클릭했을 시
  const handleChatRoomClick = (room) => {
    onClickChatRoom(room); //채팅방 생성 -> container 전송
    setChatParticipant(room.participant);
    console.log(room.participant);
    console.log("채팅방 입장");
  };

  //채팅방 목록 날짜 및 시간 표시 방법 수정
  const formatDateTime = (time) => {
    const momentTime = moment(time);
    const currentTime = moment();
    const diffDays = momentTime.diff(currentTime, "days");

    if (momentTime.isSame(currentTime, "day")) {
      return momentTime.format("a h:mm");
    } else if (diffDays === -1) {
      return "어제";
    } else {
      return momentTime.format("M월 D일");
    }
  };

  return (
    <div>
      {chatRooms.map((room, index) => (
        <div
          className={styles.chatList}
          key={index}
          onClick={() => handleChatRoomClick(room)}
        >
          <p className={styles.listProfile}>
            <img
              className={styles.profileImg}
              src={room.participant.imageUrl || anonymous_profile}
            />
          </p>
          <div className={styles.listInfo}>
            <p className={styles.listNickname}>{room.participant.nickname}</p>
            <p className={styles.listLastContent}>{room.lastMessage}</p>
          </div>
          <p className={styles.listLastTime}>
            {formatDateTime(room.lastMessageTime)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
