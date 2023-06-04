import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN } from "../Constant/backendAPI";
import { formRequest, request } from "./APIService";

export function getMyProfile() {
  return request({
    url: API_BASE_URL + "/api/user/profile",
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
