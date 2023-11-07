import { API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";

export function getUserProfile(userId) {
  return request({
    url: API_BASE_URL + "/api/user/profile/" + userId,
    method: "GET",
  });
}

export function getUserTravel(userId, isVisited, pageForm) {
  return request({
    url:
      API_BASE_URL +
      "/api/travel/user/" +
      userId +
      `?isVisited=${isVisited}` +
      `&page=${pageForm.page}&size=${pageForm.size}&sort=${pageForm.sort}`,
    method: "GET",
  });
}

class AuthService {}
export default new AuthService();
