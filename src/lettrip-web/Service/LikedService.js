import { API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";

export function checkIfLiked(likedType, targetId) {
  return request({
    url:
      API_BASE_URL +
      "/api/liked/check" +
      `?likedType=${likedType}&targetId=${targetId}`,
    method: "GET",
  });
}

export function pushLiked(requestForm) {
  return request({
    url: API_BASE_URL + "/api/liked/push",
    method: "POST",
    body: JSON.stringify(requestForm),
  });
}

export function deleteLiked(requestForm) {
  return request({
    url: API_BASE_URL + "/api/liked/delete",
    method: "POST",
    body: JSON.stringify(requestForm),
  });
}
