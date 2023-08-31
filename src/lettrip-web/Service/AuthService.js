import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/login",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
} //로그인 요청

export function requestEmailCode(email) {
  return request({
    url: API_BASE_URL + "/api/auth/email-code/" + email,
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

export function confirmPassword(password) {
  return request({
    url: API_BASE_URL + "/api/auth/confirm",
    method: "POST",
    body: JSON.stringify(password),
  });
} //비밀번호 확인 요청

export function deleteAccount(Id) {
  return request({
    url: API_BASE_URL + "/api/auth/delete/" + Id,
    method: "DELETE",
  });
} //회원 탈퇴 요청

export function checkIfLoggedIn() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    window.alert("로그인이 필요한 서비스입니다.");
    return false;
  }
  return true;
} //로그인 여부 확인 - 토큰

class AuthService {}
export default new AuthService();
