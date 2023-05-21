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

export function Checklogin(checkloginRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/login",
    method: "GET",
    body: JSON.stringify(checkloginRequest),
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

export function ListArticle(articleListRequest) {
  return request({
    url: API_BASE_URL + "/api/articles",
    method: "GET",
    body: JSON.stringify(articleListRequest),
  });
}

export function PageArticle(articlePageRequest) {
  return request({
    url: API_BASE_URL + "/api/articles",
    method: "GET",
    body: JSON.stringify(articlePageRequest),
  });
}

export function ArticleData(articleID) {
  return request({
    url: API_BASE_URL + "/api/articles/${articleID}",
    method: "GET",
    body: JSON.stringify(articleID),
  });
}

export function CreateComment(commentCreateRequest) {
  return request({
    url: API_BASE_URL + "/api/comments",
    method: "POST",
    body: JSON.stringify(commentCreateRequest),
  });
}

export function ModifyComment(commentModifyRequest) {
  return request({
    url: API_BASE_URL + "/api/comments",
    method: "PUT",
    body: JSON.stringify(commentModifyRequest),
  });
}

export function DeleteComment(commentDeleteRequest) {
  return request({
    url: API_BASE_URL + "/api/comments",
    method: "DELETE",
    body: JSON.stringify(commentDeleteRequest),
  });
}

export function ListComment(commentListRequest) {
  return request({
    url: API_BASE_URL + "/api/comments",
    method: "GET",
    body: JSON.stringify(commentListRequest),
  });
}

export function CommentData(commentID) {
  return request({
    url: API_BASE_URL + "/api/comments/${commentID}",
    method: "GET",
    body: JSON.stringify(commentID),
  });
}

export function CreateReplyComment(commentReplyCreateRequest) {
  return request({
    url: API_BASE_URL + "/api/comments",
    method: "POST",
    body: JSON.stringify(commentReplyCreateRequest),
  });
}

export function DeleteReplyComment(commentReplyDeleteRequest) {
  return request({
    url: API_BASE_URL + "/api/comments",
    method: "DELETE",
    body: JSON.stringify(commentReplyDeleteRequest),
  });
}

export function ReplyCommentData(commentID) {
  return request({
    url: API_BASE_URL + "/api/comments/${commentID}",
    method: "GET",
    body: JSON.stringify(commentID),
  });
}

export function PageCourse(coursePageRequest) {
  return request({
    url: API_BASE_URL + "/api/travel",
    method: "GET",
    body: JSON.stringify(coursePageRequest),
  });
}

class AuthService {}
export default new AuthService();
