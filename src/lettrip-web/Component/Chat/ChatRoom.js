import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as StompJs from "@stomp/stompjs";
import moment from "moment"; //날짜 설정하는 라이브러리
import "moment/locale/ko";
import styles from "./Chat.module.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsSendFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import ChatOption from "./ChatOption";

function ChatRoom({ enterChatRoom, chatHistory, handleMeetUpId }) {
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState("");
  const [status, setStatus] = useState("false");
  const client = useRef({});
  const [userId, setUserId] = useState(1);

  const [chatRoomInfo, setChatRoomInfo] = useState([]); //입장한 채팅방 정보
  const [chatHistoryInfo, setChatHistoryInfo] = useState([]); //채팅 내역
  const [isOptClicked, setIsOptClicked] = useState(false); //옵션 버튼 눌렀는지 상태

  useEffect(() => {
    setChatRoomInfo(enterChatRoom);
    setChatHistoryInfo(chatHistory);
    connect();
    return () => disconnect();
  }, [enterChatRoom, chatHistory]);

  useEffect(() => {
    //if (chatRoomInfo && chatRoomInfo.roomId) {
    //subscribe();
    //}
  }, [chatRoomInfo, chatList]);

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: "ws://13.209.3.88:8080/ws/chat",
      onConnect: () => {
        console.log("연결 성공");
        subscribe(); //연결 성공 시 채팅방 입장 (구독)
      },
    });
    client.current.activate(); // 클라이언트 활성화
  };

  const publish = (chat, status) => {
    if (!client.current.connected) console.log("채팅 연결 실패!");
    const sendData = {
      roomId: chatRoomInfo.roomId,
      senderId: chatRoomInfo.currentUserId,
      receiverId: chatRoomInfo.participant.id,
      message: chat,
      isImage: status,
    };
    client.current.publish({
      destination: "/pub/message",
      body: JSON.stringify(sendData),
    });
    setChat("");
    console.log(sendData);
  };

  //사진을 보낼 때
  const handleImageFile = (imageUrl) => {
    console.log(imageUrl);
    setStatus("true");
    if (imageUrl !== undefined) {
      publish(imageUrl, status);
    }
    console.log(status);
  };

  const handleSchedule = (MeetUpId) => {
    handleMeetUpId(MeetUpId);
    console.log(MeetUpId);
  };

  // 구독한 채널에서 메시지가 왔을 때 처리
  const subscribe = () => {
    if (chatRoomInfo && chatRoomInfo.roomId) {
      client.current.subscribe(
        `/sub/chat/${chatRoomInfo.roomId}`,
        ({ body }) => {
          const newMessage = JSON.parse(body);
          const momentTime = moment();
          const localCreatedAt = momentTime.format("a h:mm");
          setChatList((prevMessages) => [
            ...prevMessages,
            {
              ...newMessage,
              createdAt: localCreatedAt,
            },
          ]);
        }
      );
    }
  };

  const disconnect = () => {
    client.current.deactivate();
    console.log("채팅 종료!");
  };

  const handleChange = (e) => {
    setChat(e.target.value);
  };

  const handleSubmit = (e, chat) => {
    e.preventDefault();
    setStatus("false");
    // 채팅 내용이 비어있지 않은 경우에만 전송
    if (chat.trim() !== "") {
      publish(chat, status);
    }
  };

  const formatDateTime = (time) => {
    const momentTime = moment(time);
    return momentTime.format("a h:mm");
  };

  const optionIcon = isOptClicked ? (
    <RxCross2 className={styles.optIcon} />
  ) : (
    <AiOutlinePlusCircle className={styles.optIcon} />
  ); // 아이콘 설정
  const handleOptClick = (e) => {
    e.preventDefault();
    setIsOptClicked(!isOptClicked);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatRoomContent}>
        {enterChatRoom && enterChatRoom.participant && chatHistoryInfo ? (
          <div className={styles.chatMessages}>
            {chatHistoryInfo.map((message, index) => (
              <div key={index} className={styles.message}>
                <img
                  className={styles.chatProfileImg}
                  src={anonymous_profile}
                  alt='Profile'
                />
                <div className={styles.messageContent}>
                  {message.isImage == "true" ? (
                    <img
                      src={message.message}
                      alt='Image'
                      className={styles.msgImage}
                    />
                  ) : (
                    <p>{message.message}</p>
                  )}
                  <p> {formatDateTime(message.createdAt)}</p>
                </div>
              </div>
            ))}
            <h3>새로운 메시지</h3>
            {chatList.map((newMessage, index) => (
              <div key={index} className={styles.message}>
                <img
                  className={styles.chatProfileImg}
                  src={anonymous_profile}
                  alt='Profile'
                />
                <div className={styles.messageContent}>
                  {newMessage.isImage == "true" ? (
                    <img
                      src={newMessage.message}
                      alt='Image'
                      className={styles.msgImage}
                    />
                  ) : (
                    <p>{newMessage.message}</p>
                  )}
                  <p>{formatDateTime(newMessage.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className={styles.chatSendBox}>
        <form
          onSubmit={(event) => handleSubmit(event, chat)}
          className={styles.chatSendForm}
        >
          <p onClick={handleOptClick} className={styles.chatOptBtn}>
            {optionIcon}
          </p>

          <div className={styles.chatInputBox}>
            <input
              type='text'
              name='chatInput'
              onChange={handleChange}
              value={chat}
              placeholder='메세지를 입력하세요'
              className={styles.chatInput}
              required
            />
            <BsSendFill
              input
              type='submit'
              value='Send'
              className={styles.chatSendBtn}
            />
          </div>
        </form>

        {isOptClicked ? (
          <ChatOption
            isOptClicked={isOptClicked}
            handleImageFile={handleImageFile}
            handleSchedule={handleSchedule}
            chatRoomInfo={chatRoomInfo}
          />
        ) : null}
      </div>
    </div>
  );
}

export default ChatRoom;
