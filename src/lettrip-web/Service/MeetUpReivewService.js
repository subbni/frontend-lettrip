import { API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";

export function createMeetUpReview(meetUpReviewForm) {
  return request({
    url: API_BASE_URL + "/api/meetUpReview/create",
    method: "POST",
    body: JSON.stringify(meetUpReviewForm),
  });
} //한줄평 작성하기

export function showMyMeetUpReview(pageForm) {
  return request({
    url:
      API_BASE_URL +
      "/api/meetUpReview/my" +
      `?meetUpStatus=${pageForm.meetUpStatus}&page=${pageForm.page}&size=${pageForm.size}&sort=${pageForm.sort}`,
    method: "GET",
  });
} //본인 한줄평 조회

export function showUserMeetUpReview(id) {
  return request({
    url: API_BASE_URL + "/api/meetUpReview/user/" + id,
    method: "GET",
  });
} //특정 인물 한줄평 조회

class AuthService {}
export default new AuthService();
