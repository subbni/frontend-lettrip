import React, { useState, useEffect } from "react";
import { listChatRoom, showChatHistory } from "../../Service/ChatService";
import moment from "moment"; //날짜 설정하는 라이브러리
import "moment/locale/ko";
import styles from "./Chatting.module.css";
import { AiOutlineFileText } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import { MdOutlineLocationOn, MdOutlineLocationOff } from "react-icons/md"; //gps on/off 아이콘
import { RxCross2 } from "react-icons/rx";
import anonymous_profile from "../../.././image/lettrip_anonymous_profile.png"; //프로필 이미지
import ChatList from "./ChatList"; //채팅방 목록
import Chatting from "./Chatting"; //채팅 (웹소켓)

function ChatContainer() {
  const [chatRooms, setChatRooms] = useState([]); //채팅방 목록 상태
  const [enterChatRoom, setEnterChatRoom] = useState([]); //입장한 채팅방 정보
  const [chatHistory, setChatHistory] = useState([]); //해당 채팅방 채팅 목록 불러오기
  const [chatParticipant, setChatParticipant] = useState([]); //해당 채팅방 상대 정보
  const [meetUpId, setMeetUpId] = useState(null); //만남 Id
  const [selectedIcon, setSelectedIcon] = useState("post");

  useEffect(() => {
    loadChatRooms(); // 추가: 채팅방 목록을 불러옴
    console.log("채팅불러오기");
  }, []);

  const toggleIcon = () => {
    if (selectedIcon === "post") {
      setSelectedIcon("schedule"); // 아이콘 변경
    } else {
      setSelectedIcon("post"); // 아이콘 변경
    }
  };

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

  //접속한 채팅방 정보 가져오기
  const onClickChatRoom = (room) => {
    console.log(room);
    setEnterChatRoom(room);
    setChatParticipant(room.participant);
    showChatHistory(room.roomId)
      .then((response) => {
        setChatHistory(response.content);
        console.log(response.content);
      })
      .catch((error) => {
        console.error("채팅 목록을 불러오지 못했습니다.", error);
      });
  };

  //만남 Id 가져오기
  const handleMeetUpId = (MeetUpId) => {
    console.log(MeetUpId);
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPage}>
        <div className={styles.leftHeader}>
          <h3 className={styles.headerText}> 채팅 </h3>
        </div>
        <ChatList chatRooms={chatRooms} onClickChatRoom={onClickChatRoom} />
      </div>
      <div className={styles.rightPage}>
        <div className={styles.rightHeader}>
          <div className={styles.header01}>
            <img
              className={styles.headerImage}
              src={
                chatParticipant.imageUrl
                  ? chatParticipant.imageUrl
                  : anonymous_profile
              }
              alt='Chat-Image'
            />
            <span className={styles.headerNickname}>
              {chatParticipant.nickname}
            </span>
            {selectedIcon === "post" ? ( // 아이콘 선택에 따라 표시
              <AiOutlineFileText
                className={styles.headerOption}
                onClick={toggleIcon}
              />
            ) : (
              <FiCalendar
                className={styles.headerOption}
                onClick={toggleIcon}
              />
            )}
            <RxCross2 className={styles.headerCancel} />
          </div>
          {selectedIcon === "post" ? ( // 아이콘 선택에 따라 내용 표시
            <div className={styles.header02}>
              <div className={styles.headerInfo}>
                <div className={styles.postInfo}>
                  <span className={styles.postGps}>Gps</span>
                  {/*        {post.isGPSEnabled === true ? (
              <>
                <MdOutlineLocationOn className={styles.gpsIcon} /> GPS 정보 필요
              </>
            ) : (
              <>
                <MdOutlineLocationOff className={styles.gpsIcon} /> GPS 정보
                불필요
              </>
            )} */}
                  <span className={styles.postTitle}>제목</span>
                </div>
                <div className={styles.postAddress}>
                  <span className={styles.postProvince}>서울특별시</span>
                  <span className={styles.postCity}>서울</span>
                </div>
              </div>
              <button className={styles.postBtn}>매칭글 보기</button>
            </div>
          ) : (
            <div className={styles.header03}>
              <div className={styles.headerInfo}>
                <div className={styles.postInfo}>
                  <span className={styles.planTitle}>등록 된 약속</span>
                </div>
                <div className={styles.postAddress}>
                  <span className={styles.calendarBackground}>
                    <FiCalendar className={styles.calendarIcon} />
                  </span>
                  <span className={styles.postCity}>시간</span>
                </div>
              </div>
              <button className={styles.postBtn}>인증하기</button>
            </div>
          )}
        </div>

        <Chatting chatHistory={chatHistory} enterChatRoom={enterChatRoom} />
        <div className={styles.chatOption}></div>
      </div>
    </div>
  );
}

export default ChatContainer;
