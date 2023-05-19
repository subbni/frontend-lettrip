import { API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/login",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function SignUp(signUpRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/sign-up",
    method: "POST",
    body: JSON.stringify(signUpRequest),
  });
}

export function Checklogin(CheckloginRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/login",
    method: "GET",
    body: JSON.stringify(CheckloginRequest),
  });
}

export function CreateArticle(articleCreateRequest) {
  return request({
    url: API_BASE_URL + "/api/articles/create",
    method: "POST",
    body: JSON.stringify(articleCreateRequest),
  });
}

export function ModifyArticle(articleModifyRequest) {
  return request({
    url: API_BASE_URL + "/api/articles/modify",
    method: "PUT",
    body: JSON.stringify(articleModifyRequest),
  });
}

export function DeleteArticle(articleDeleteRequest) {
  return request({
    url: API_BASE_URL + "/api/articles/modify",
    method: "DELETE",
    body: JSON.stringify(articleDeleteRequest),
  });
}

export function ArticleList(articleListRequest) {
  return request({
    url: API_BASE_URL + "/api/articles",
    method: "GET",
    body: JSON.stringify(articleListRequest),
  });
}

export function ArticlePage(articlePageRequest) {
  return request({
    url: API_BASE_URL + "/api/articles",
    method: "GET",
    body: JSON.stringify(articlePageRequest),
  });
}

class AuthService {}
export default new AuthService();
