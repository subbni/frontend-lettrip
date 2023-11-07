import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment"; //날짜 설정하는 라이브러리
import "moment/locale/ko";
import { listChatRoom, showChatHistory } from "../../Service/ChatService";
import { showMeetUpPost } from "../../Service/MeetUpPostService";
import { showMeetUp } from "../../Service/MeetUpService";
import styles from "./Chatting.module.css";
import { AiOutlineFileText } from "react-icons/ai";
import { LuCalendar } from "react-icons/lu";
import { MdOutlineLocationOn, MdOutlineLocationOff } from "react-icons/md"; //gps on/off 아이콘
import { RxCross2 } from "react-icons/rx";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import logo from "../../../image/logo.png"; //로고 이미지
import ChatList from "./ChatList"; //채팅방 목록
import Chatting from "./Chatting"; //채팅 (웹소켓)
import ChatMeetUp from "./ChatMeetUp";
import ChatMeetUpReview from "./ChatMeetUpReview";

function ChatContainer() {
  const navigate = useNavigate();
  const [chatRooms, setChatRooms] = useState([]); //채팅방 목록 상태
  const [enterChatRoom, setEnterChatRoom] = useState([]); //입장한 채팅방 정보
  const [chatHistory, setChatHistory] = useState([]); //해당 채팅방 채팅 목록 불러오기
  const [chatParticipant, setChatParticipant] = useState([]); //해당 채팅방 상대 정보
  const [selectedIcon, setSelectedIcon] = useState("calendar");
  const [post, setPost] = useState(null);
  const [meetUp, setMeetUp] = useState(null);
  const [isVerify, setIsVerify] = useState(false); //인증하기 버튼 눌렀는지
  const [status, setStatus] = useState(false); //만남 인증완료됐는지
  const [isReview, setIsReview] = useState(false); //인증하기 버튼 눌렀는지

  useEffect(() => {
    loadChatRooms();
    if (enterChatRoom) {
      if (
        enterChatRoom.meetUpStatus === "COMPLETED" ||
        enterChatRoom.meetUpStatus === "CANCELLED"
      ) {
        setStatus(true);
      } else {
        setStatus(false);
      }
    } else {
      setStatus(false);
    }
    console.log(status);
  }, [enterChatRoom]);

  //상단 옵션 버튼
  const toggleIcon = () => {
    setSelectedIcon(selectedIcon === "calendar" ? "post" : "calendar");
  };
  //채팅방 나가기
  const onClickCross = () => {
    setEnterChatRoom([]); // chatRoom 초기화
  };

  const onClickVerify = () => {
    setIsVerify(true);
  };

  const onClickReview = () => {
    setIsReview(true);
    console.log(isReview);
    setIsVerify(true);
  };

  //채팅방 목록을 불러오기
  const checkStatus = () => {};

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
    showChatHistory(room.roomId) //채팅 기록 불러오기
      .then((response) => {
        setChatHistory(response.content);
        console.log(response.content);
      })
      .catch((error) => {
        console.error("채팅 목록을 불러오지 못했습니다.", error);
      });
    showMeetUpPost(room.meetUpPostId) //매칭글 불러오기
      .then((response) => {
        console.log(response);
        setPost(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
      });
    if (room.meetUpId) {
      showMeetUp(room.meetUpId) //만남 일정 불러오기
        .then((response) => {
          console.log(response);
          setMeetUp(response);
        })
        .catch((e) => {
          console.log(e);
          window.alert("불러오기에 실패했습니다. 다시 시도해주시길 바랍니다.");
        });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPage}>
        <div className={styles.leftHeader}>
          <h3 className={styles.text}> 채팅 </h3>
        </div>
        <ChatList chatRooms={chatRooms} onClickChatRoom={onClickChatRoom} />
      </div>
      {enterChatRoom.roomId && (
        <div className={styles.rightPage}>
          <div className={styles.rightHeader}>
            <div className={styles.chatInfoHedaer}>
              <img
                className={styles.chatProfileImage}
                src={
                  chatParticipant.imageUrl
                    ? chatParticipant.imageUrl
                    : anonymous_profile
                }
                alt='Chat-Image'
              />
              <span className={styles.chatProfileNickname}>
                {chatParticipant.nickname}
              </span>
              {selectedIcon === "post" ? ( // 아이콘 선택에 따라 표시
                <AiOutlineFileText
                  className={styles.chatHeaderOptionBtn}
                  onClick={toggleIcon}
                />
              ) : (
                <LuCalendar
                  className={styles.chatHeaderOptionBtn}
                  onClick={meetUp !== null ? toggleIcon : null}
                />
              )}
              <RxCross2
                className={styles.chatCancelBtn}
                onClick={onClickCross}
              />
            </div>
            {isVerify ? (
              isReview ? (
                <ChatMeetUpReview
                  meetUp={meetUp}
                  chatParticipant={chatParticipant}
                />
              ) : (
                <ChatMeetUp
                  enterChatRoom={enterChatRoom}
                  post={post}
                  meetUp={meetUp}
                />
              )
            ) : (
              <div className={styles.chatHeaderOption}>
                {post && selectedIcon === "calendar" ? ( // 아이콘 선택에 따라 내용 표시
                  <div className={styles.chatPostInfoHeader}>
                    <div className={styles.infoHeader}>
                      <div className={styles.postInfo}>
                        {post.isGpsEnabled === true ? (
                          <MdOutlineLocationOn className={styles.gpsIcon} />
                        ) : (
                          <MdOutlineLocationOff className={styles.gpsIcon} />
                        )}
                        <span className={styles.postTitle}>{post.title}</span>
                      </div>
                      <div className={styles.postAddress}>
                        <span className={styles.postProvince}>
                          {post.province}
                        </span>
                        <span className={styles.postCity}>{post.city}</span>
                      </div>
                    </div>
                    <button
                      className={styles.headerBtn}
                      onClick={() => navigate(`/friend/${post.id}`)}
                    >
                      매칭글 보기
                    </button>
                  </div>
                ) : (
                  meetUp && (
                    <div className={styles.chatMeetUpInfoHeader}>
                      <div className={styles.infoHeader}>
                        <span className={styles.planTitle}>등록 된 약속</span>
                        <div className={styles.planCalendar}>
                          <span className={styles.calendarBackground}>
                            <LuCalendar className={styles.calendarIcon} />
                          </span>
                          <span className={styles.planDate}>
                            {meetUp.meetUpDate}
                          </span>
                        </div>
                      </div>
                      {status ? (
                        <button
                          className={styles.headerBtn}
                          onClick={onClickReview}
                        >
                          한줄평 작성
                        </button>
                      ) : (
                        <button
                          className={styles.headerBtn}
                          onClick={onClickVerify}
                        >
                          인증하기
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <Chatting chatHistory={chatHistory} enterChatRoom={enterChatRoom} />
        </div>
      )}
      {!enterChatRoom.roomId && (
        <div className={styles.logo}>
          <img src={logo} alt='Logo' className={styles.logoImage} />
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
