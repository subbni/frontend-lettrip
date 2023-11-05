import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN } from "../Constant/backendAPI";
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

export function uploadChatImage(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
    },
  };
  return axios
    .post(API_BASE_URL + "/api/file/upload", formData, config)
    .then((response) => {
      console.log("이미지 업로드 성공", response);
      return response.data; // 이 부분은 필요에 따라 수정할 수 있습니다.
    })
    .catch((error) => {
      console.error("이미지 업로드 실패", error);
      throw error; // 실패한 경우 예외를 throw할 수 있습니다.
    });
}
//웹소켓 채팅방 사진 첨부

class AuthService {}
export default new AuthService();
