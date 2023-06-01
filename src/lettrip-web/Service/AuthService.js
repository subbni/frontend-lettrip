import { API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/login",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
} //로그인 요청

export function requestEmailCode(email) {
  console.log(email);
  return request({
    url: API_BASE_URL + `/api/auth/email-code/${email}`,
    method: "GET",
  });
} //이메일 인증 요청

export function requestEmailVerify(code) {
  return request({
    url: API_BASE_URL + "/api/auth/email-verify/" + code,
    method: "GET",
  });
} //이메일 인증 확인 요청

export function signUp(signUpRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/sign-up",
    method: "POST",
    body: JSON.stringify(signUpRequest),
  });
} //회원가입 요청

export function PageCourse(coursePageRequest) {
  return request({
    url: API_BASE_URL + "/api/travel",
    method: "GET",
    body: JSON.stringify(coursePageRequest),
  });
} //여행 코스 상세페이지 불러오기 요청

export function CreateReview(reviewCreateRequest) {
  return request({
    url: API_BASE_URL + "/api/travel/create",
    method: "POST",
    body: JSON.stringify(reviewCreateRequest),
  });
} //게시글 작성 등록 요청

export function ModifyReview(reviewModifyRequest) {
  return request({
    url: API_BASE_URL + "/api/travel/modify",
    method: "PUT",
    body: JSON.stringify(reviewModifyRequest),
  });
} //게시글 수정하기 위해서 원글 불러오기 요청

class AuthService {}
export default new AuthService();
