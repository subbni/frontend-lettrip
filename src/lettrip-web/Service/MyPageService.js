import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN } from "../Constant/backendAPI";
import { formRequest, request } from "./APIService";

export function getMyProfile() {
  return request({
    url: API_BASE_URL + "/api/user/profile",
    method: "GET",
  });
}

export function modifyMyProfile(accountForm, id) {
  return request({
    url: API_BASE_URL + "/api/user/profile/modify",
    method: "PUT",
    body: JSON.stringify(accountForm, id),
  });
} //마이페이지 프로필 수정 요청

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
