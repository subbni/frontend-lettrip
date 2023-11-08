import { useRef, useState, useEffect } from "react";
import * as StompJs from "@stomp/stompjs";
import moment from "moment"; //날짜 설정하는 라이브러리
import "moment/locale/ko";
import styles from "./Chatting.module.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsSendFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import anonymous_profile from "../../../image/lettrip_anonymous_profile.png"; //프로필 이미지
import ChatOption from "./ChatOption";

function Chatting({ enterChatRoom, chatHistory, loadMeetUp }) {
  const client = useRef({});
  const [chatList, setChatList] = useState([]); //새로운 메시지
  const [chat, setChat] = useState(""); //입력하는 메시지
  const [status, setStatus] = useState("false"); //isImage 상태
  const [isOptClicked, setIsOptClicked] = useState(false); //옵션 버튼 눌렀는지 상태

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    setChatList([]);
  }, [enterChatRoom]);

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: "ws://3.36.64.137:8080/ws/chat",
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
      roomId: enterChatRoom.roomId,
      senderId: enterChatRoom.currentUserId,
      receiverId: enterChatRoom.participant.id,
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
    if (imageUrl !== undefined) {
      setStatus("true");
      publish(imageUrl, status);
      setStatus("false");
      setIsOptClicked(false);
    }
  };

  const onMeetUpScheduled = (meetUpId) => {
    loadMeetUp(meetUpId);
    /* if (meetUpId !== null) {
      publish("만남 일정이 등록되었습니다. 상단에서 확인하세요.", "false");

      setIsOptClicked(false);
    }*/
  };

  // 구독한 채널에서 메시지가 왔을 때 처리
  const subscribe = () => {
    if (enterChatRoom && enterChatRoom.roomId) {
      client.current.subscribe(
        `/sub/chat/${enterChatRoom.roomId}`,
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
    <div className={styles.chatRoomContainer}>
      <div className={styles.chatRoomContent}>
        {enterChatRoom && enterChatRoom.participant && chatHistory ? (
          <div className={styles.chatMessages}>
            {chatHistory.map((message, index) => (
              <div key={index} className={styles.messageBox}>
                {message.senderId !== enterChatRoom.currentUserId && (
                  <img
                    className={styles.chatProfileImg}
                    src={
                      enterChatRoom.participant.imageUrl
                        ? enterChatRoom.participant.imageUrl
                        : anonymous_profile
                    }
                    alt='Chat-Image'
                  />
                )}
                {message.senderId !== enterChatRoom.currentUserId ? (
                  <div className={styles.message}>
                    {message.isImage === true ? (
                      <img
                        src={message.message}
                        alt='Image'
                        className={styles.messageImage}
                      />
                    ) : (
                      <p className={styles.messageText}>{message.message}</p>
                    )}
                    <p className={styles.messageTime}>
                      {formatDateTime(message.createdAt)}
                    </p>
                  </div>
                ) : (
                  <div className={styles.myMessage}>
                    <p className={styles.MymessageTime}>
                      {formatDateTime(message.createdAt)}
                    </p>
                    {message.isImage === true ? (
                      <img
                        src={message.message}
                        alt='Image'
                        className={styles.messageImage}
                      />
                    ) : (
                      <p className={styles.messageText}>{message.message}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            <h3 className={styles.chatText}>새로운 메시지</h3>
            {chatList.map((newMessage, index) => (
              <div key={index} className={styles.messageBox}>
                {newMessage.senderId !== enterChatRoom.currentUserId && (
                  <img
                    className={styles.chatProfileImg}
                    src={
                      enterChatRoom.participant.imageUrl
                        ? enterChatRoom.participant.imageUrl
                        : anonymous_profile
                    }
                    alt='Chat-Image'
                  />
                )}
                {newMessage.senderId !== enterChatRoom.currentUserId ? (
                  <div className={styles.message}>
                    {newMessage.isImage === true ? (
                      <img
                        src={newMessage.message}
                        alt='Image'
                        className={styles.messageImage}
                      />
                    ) : (
                      <p className={styles.messageText}>{newMessage.message}</p>
                    )}
                    <p className={styles.messageTime}>{newMessage.createdAt}</p>
                  </div>
                ) : (
                  <div className={styles.myMessage}>
                    <p className={styles.MymessageTime}>
                      {newMessage.createdAt}
                    </p>
                    {newMessage.isImage === true ? (
                      <img
                        src={newMessage.message}
                        alt='Image'
                        className={styles.messageImage}
                      />
                    ) : (
                      <p className={styles.messageText}>{newMessage.message}</p>
                    )}
                  </div>
                )}
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
            enterChatRoom={enterChatRoom}
            onMeetUpScheduled={onMeetUpScheduled}
          />
        ) : null}
      </div>
    </div>
  );
}

export default Chatting;
