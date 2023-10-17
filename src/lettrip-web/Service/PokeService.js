import { API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";

export function createPoke(pokeForm) {
  return request({
    url: API_BASE_URL + "/api/poke/create",
    method: "POST",
    body: JSON.stringify(pokeForm),
  });
} //쿡 찌르기 등록 요청

export function deletePoke(meetUpPostId) {
  return request({
    url: API_BASE_URL + `/api/poke/delete/${meetUpPostId}`,
    method: "DELETE",
  });
} //쿡 찌르기 삭제 요청

export function checkPoke(meetUpPostId) {
  return request({
    url: API_BASE_URL + `/api/poke/check/${meetUpPostId}`,
    method: "GET",
  });
} //쿡 찌르기 전체 조회 요청

export function showAllPokesInMeetUpPost(meetUpPostId) {
  return request({
    url: API_BASE_URL + `/api/poke/${meetUpPostId}`,
    method: "GET",
  });
} //쿡 찌르기 전체 조회 요청

export function createChatRoom(chatRoomForm) {
  return request({
    url: API_BASE_URL + "/api/chat/room/create",
    method: "POST",
    body: JSON.stringify(chatRoomForm),
  });
} //웹소켓 채팅방 생성 요청

class AuthService {}
export default new AuthService();
