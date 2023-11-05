import React, { useState, useEffect } from "react";
import { listChatRoom, showChatHistory } from "../../Service/ChatService";
import moment from "moment"; //날짜 설정하는 라이브러리
import "moment/locale/ko";

import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지

import { RxCross2 } from "react-icons/rx";
import styles from "./Chat.module.css";
import ChatRoom from "./ChatRoom";
import ChatHeaderOpt from "./ChatHeaderOpt";

function ChatTemplate() {
  const [chatRooms, setChatRooms] = useState([]); //채팅방 목록 상태
  const [enterChatRoom, setEnterChatRoom] = useState(null); //채팅방 입장 (현재 접속중인 채팅방)
  const [chatHistory, setChatHistory] = useState([]); //채팅 목록 저장
  const [nickname, setNickname] = useState(""); //닉네임 저장
  const [meetUpId, setMeetUpId] = useState(null);

  useEffect(() => {
    loadChatRooms(); // 추가: 채팅방 목록을 불러옴
    console.log("채팅불러오기");
  }, []);

  //채팅방 목록을 불러오기
  const loadChatRooms = () => {
    listChatRoom()
      .then((response) => {
        setChatRooms(response.content); // 채팅방 목록을 상태에 저장
        console.log(response.content);
      })
      .catch((error) => {
        console.error("채팅방 목록을 불러오지 못했습니다.", error);
      });
  };

  const handleChatRoomClick = (room) => {
    setEnterChatRoom(room);
    //setMeetUpId(room.meetUpId);
    setMeetUpId("1");
    console.log("채팅방입장");
    showChatHistory(room.roomId)
      .then((response) => {
        setChatHistory(response.content);
        console.log(response.content);
      })
      .catch((error) => {
        console.error("채팅 목록을 불러오지 못했습니다.", error);
      });
  };

  // 날짜 및 시간 표시 방법 수정
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

  const handleMeetUpId = (MeetUpId) => {
    console.log(MeetUpId);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.listHeader}>
          <h2 className={styles.headerText}>채팅</h2>
        </div>
        <div className={styles.chatHeader}>
          <img className={styles.headerImg} src={anonymous_profile} />
          <p className={styles.headerNickname}>닉네임</p>
          <ChatHeaderOpt meetUpId={meetUpId} enterChatRoom={enterChatRoom} />
          <p className={styles.headerBtn}>
            <RxCross2 className={styles.headerIcon} />
          </p>
        </div>
      </div>
      <div className={styles.contaner}>
        <div className={styles.listContainer}>
          {chatRooms.map((room, index) => (
            <div
              className={styles.chatRoomList}
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
                <p className={styles.listNickname}>
                  {room.participant.nickname}
                </p>
                <p className={styles.listLastContent}>{room.lastMessage}</p>
              </div>
              <p className={styles.listLastTime}>
                {formatDateTime(room.lastMessageTime)}
              </p>
            </div>
          ))}
        </div>
        <ChatRoom
          enterChatRoom={enterChatRoom}
          chatHistory={chatHistory}
          handleMeetUpId={handleMeetUpId}
        />
      </div>
    </div>
  );
}

export default ChatTemplate;
