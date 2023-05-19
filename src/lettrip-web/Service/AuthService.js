import { API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/login",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function requestEmailCode(email) {
  console.log(email);
  return request({
    url: API_BASE_URL + `/api/auth/email-code/${email}`,
    method: "GET",
  });
}

export function requestEmailVerify(code) {
  return request({
    url: API_BASE_URL + "/api/auth/email-verify/" + code,
    method: "GET",
  });
}

export function signUp(signUpRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/sign-up",
    method: "POST",
    body: JSON.stringify(signUpRequest),
  });
}

class AuthService {}
export default new AuthService();
