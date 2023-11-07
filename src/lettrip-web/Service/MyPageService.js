import { API_BASE_URL } from "../Constant/backendAPI";
import { formRequest, request } from "./APIService";

export function getMyProfile() {
  return request({
    url: API_BASE_URL + "/api/user/profile",
    method: "GET",
  });
}

export function getUserProfile(id) {
  return request({
    url: API_BASE_URL + "/api/user/profile" + id,
    method: "GET",
  });
}

export function getMyTravel(isVisited, pageForm) {
  return request({
    url:
      API_BASE_URL +
      "/api/travel/my" +
      `?isVisited=${isVisited}` +
      `&page=${pageForm.page}&size=${pageForm.size}&sort=${pageForm.sort}`,
    method: "GET",
  });
}

export function getMyLikedTravel(pageForm) {
  return request({
    url:
      API_BASE_URL +
      "/api/travel/my/liked" +
      `?page=${pageForm.page}&size=${pageForm.size}&sort=${pageForm.sort}`,
    method: "GET",
  });
}

export function getMyArticle(pageForm) {
  return request({
    url:
      API_BASE_URL +
      "/api/articles/my" +
      `?page=${pageForm.page}&size=${pageForm.size}&sort=${pageForm.sort}`,
    method: "GET",
  });
}

export function modifyMyImage(userForm) {
  return request({
    url: API_BASE_URL + "/api/user/update/image",
    method: "POST",
    body: JSON.stringify(userForm),
  });
} //마이페이지 프로필 사진 수정 요청

export function modifyMyNickname(nickname) {
  return request({
    url: API_BASE_URL + "/api/user/update/nickname",
    method: "POST",
    body: JSON.stringify(nickname),
  });
} //마이페이지 프로필 닉네임 수정 요청

export function modifyMyPassword(password) {
  return request({
    url: API_BASE_URL + "/api/user/update/password",
    method: "POST",
    body: JSON.stringify(password),
  });
} //마이페이지 프로필 비밀번호 수정 요청

export function checkMyPassword(userForm) {
  return request({
    url: API_BASE_URL + "/api/user/check/password",
    method: "POST",
    body: JSON.stringify(userForm),
  });
} //마이페이지 프로필 비밀번호 확인 요청

//내가 쓴 meetUpPost 글 목록 불러오기
export function getMyMeetUpPost(pageForm) {
  return request({
    url:
      API_BASE_URL +
      "/api/meetUpPost/my" +
      `?page=${pageForm.page}&size=${pageForm.size}&sort=${pageForm.sort}`,
    method: "GET",
  });
}
//내가 찌른 meetUpPost 글 목록 불러오기
export function getMyPoke(pageForm) {
  return request({
    url:
      API_BASE_URL +
      "/api/meetUpPost/my/poked" +
      `?page=${pageForm.page}&size=${pageForm.size}&sort=${pageForm.sort}`,
    method: "GET",
  });
}

class AuthService {}
export default new AuthService();
