import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as StompJs from "@stomp/stompjs";

function ChatTemplate() {
  const [chatList, setChatList] = useState([]);
  const [chat, setChat] = useState("");
  const { apply_id: id } = useParams();
  const client = useRef({});
  const [userId, setUserId] = useState(1);

  const roomId = "652e29083ca7fc2c4e1de2e1";

  useEffect(() => {
    connect();
    return () => disconnect();
  }, []);

  useEffect(() => {
    console.log(chatList);
  }, [chatList]);

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: "ws://13.125.210.42:8080/ws/chat",
      onConnect: () => {
        console.log("연결 성공");
        subscribe(); //연결 성공 시 채팅방 입장 (구독)
      },
    });
    client.current.activate(); // 클라이언트 활성화
  };

  const publish = (chat) => {
    if (!client.current.connected) console.log("채팅 연결 실패!");

    client.current.publish({
      destination: "/pub/message",
      body: JSON.stringify({
        roomId: "652e29083ca7fc2c4e1de2e1",
        senderId: userId,
        receiverId: 26,
        message: chat,
        isImage: false,
      }),
    });
    console.log("채팅보냄");

    setChat("");
  };

  // 구독한 채널에서 메시지가 왔을 때 처리
  const subscribe = () => {
    client.current.subscribe(`/sub/chat/${roomId}`, ({ body }) => {
      setChatList((_chat_list) => [..._chat_list, JSON.parse(body)]);
    });
  };

  const disconnect = () => {
    client.current.deactivate();
    console.log("채팅 종료!");
  };

  const handleChange = (event) => {
    setChat(event.target.value);
  };

  const handleSubmit = (event, chat) => {
    event.preventDefault();
    publish(chat);
  };

  return (
    <div>
      <div>
        {/* 채팅 메시지 목록을 매핑하여 화면에 출력 */}
        {chatList.map((message, index) => (
          <div key={index}>
            <strong>{message.writerId}: </strong>
            {message.message}
          </div>
        ))}
      </div>
      <form onSubmit={(event) => handleSubmit(event, chat)}>
        <div>
          <input
            type={"text"}
            name={"chatInput"}
            onChange={handleChange}
            value={chat}
          />
        </div>
        <p>{userId}:</p> <input type={"submit"} value={"전송"} />
      </form>
    </div>
  );
}

export default ChatTemplate;
