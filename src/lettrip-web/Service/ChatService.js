import { API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";

export function createChatRoom(chatRoomForm) {
  return request({
    url: API_BASE_URL + "/api/chat/room/create",
    method: "POST",
    body: JSON.stringify(chatRoomForm),
  });
} //웹소켓 채팅방 생성 요청 (쿡 찌르기 수락 시 -> 채팅방 생성)

export function listChatRoom() {
  return request({
    url: API_BASE_URL + "/api/chat/my",
    method: "GET",
  });
} //웹소켓 채팅방 리스트 조회 요청

export function showChatHistory(roomId) {
  return request({
    url: API_BASE_URL + "/api/chat/" + roomId,
    method: "GET",
  });
} //웹소켓 채팅방 내역 조회 요청

class AuthService {}
export default new AuthService();
