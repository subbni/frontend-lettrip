import { API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";

export function createMeetUpPost(meetUpPostForm) {
  return request({
    url: API_BASE_URL + "/api/meetUpPost/create",
    method: "POST",
    body: JSON.stringify(meetUpPostForm),
  });
} //친구 매칭 글 작성 등록 요청

export function modifyMeetUpPost(meetUpPostForm, id) {
  return request({
    url: API_BASE_URL + "/api/meetUpPost/modify",
    method: "PUT",
    body: JSON.stringify(meetUpPostForm, id),
  });
} //친구 매칭 글 작성 수정 요청

export function deleteMeetUpPost(id) {
  return request({
    url: API_BASE_URL + "/api/meetUpPost/delete/" + id,
    method: "DELETE",
  });
} //친구 매칭 글 작성 삭제 요청

export function showMeetUpPostList(pageForm) {
  return request({
    url:
      API_BASE_URL +
      "/api/meetUpPost" +
      `?page=${pageForm.page}&size=${pageForm.size}&sort=${pageForm.sort}`,
    method: "GET",
  });
} //친구 매칭 글 전체 목록 불러오기 요청

export function showMeetUpPost(meetUpPostId) {
  return request({
    url: API_BASE_URL + "/api/meetUpPost/" + meetUpPostId,
    method: "GET",
  });
} //친구 매칭 글 불러오기 요청

class AuthService {}
export default new AuthService();
