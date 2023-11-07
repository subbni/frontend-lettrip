import React, { useState, useEffect } from "react";
import moment from "moment"; //날짜 설정하는 라이브러리
import "moment/locale/ko";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import styles from "./Chatting.module.css";

function ChatList({ chatRooms, onClickChatRoom }) {
  useEffect(() => {
    console.log(chatRooms);
  }, []);

  //해당 채팅방 클릭했을 시
  const handleChatRoomClick = (room) => {
    onClickChatRoom(room); //채팅방 생성 -> container 전송
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
    <div className={styles.chatListContainer}>
      {chatRooms.map((room, index) => (
        <div
          className={styles.chatList}
          key={index}
          onClick={() => handleChatRoomClick(room)}
        >
          <img
            className={styles.listProfileImg}
            src={room.participant.imageUrl || anonymous_profile}
          />

          <div className={styles.listInfo}>
            <p className={styles.listNickname}>{room.participant.nickname}</p>
            <p className={styles.listMessage}>{room.lastMessage}</p>
          </div>
          <p className={styles.listTime}>
            {formatDateTime(room.lastMessageTime)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
