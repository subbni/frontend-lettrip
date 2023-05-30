import { API_BASE_URL } from "../Constant/backendAPI";
import { request } from "./APIService";
import { ACCESS_TOKEN } from "../Service/APIService";

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

export function Checklogin(checkloginRequest) {
  return request({
    url: API_BASE_URL + "/api/auth/login",
    method: "GET",
    body: JSON.stringify(checkloginRequest),
  });
} //로그인 여부 확인

export function CreateArticle(articleForm, authToken) {
  const requestBody = JSON.stringify(articleForm);
  return request({
    url: API_BASE_URL + "/api/articles/create",
    method: "POST",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json", // JSON 형식으로 요청 설정
    },
    body: requestBody,
  });
} //게시글 작성 등록 요청

export function ModifyArticle(articleForm, authToken) {
  const requestBody = JSON.stringify(articleForm);
  return request({
    url: API_BASE_URL + "/api/articles/modify",
    method: "PUT",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json", // JSON 형식으로 요청 설정
    },
    body: requestBody,
  });
} //게시글 수정 요청

export function ArticleData(articleID) {
  return request({
    url: API_BASE_URL + "/api/articles/modify",
    method: "GET",
    body: JSON.stringify(articleID),
  });
} //게시글 정보 불러오기 요청

export function DeleteArticle(articleID) {
  return request({
    url: API_BASE_URL + "/api/articles/" + articleID,
    method: "DELETE",
  });
} //게시글 삭제 요청

export function ListArticle(pageForm) {
  return request({
    url:
      API_BASE_URL +
      "/api/articles" +
      `?page=${pageForm.page}&size=${pageForm.size}&sort=${pageForm.sort}`,
    method: "GET",
  });
} //게시글 목록 불러오기 요청

export function PageArticle(articleID) {
  return request({
    url: API_BASE_URL + "/api/articles" + { articleID },
    method: "GET",
  });
} //게시글 불러오기 요청

export function CreateComment(commentCreateRequest) {
  return request({
    url: API_BASE_URL + "/api/comment/create",
    method: "POST",
    body: JSON.stringify(commentCreateRequest),
  });
} //댓글 작성 등록 요청

export function ModifyComment(commentModifyRequest) {
  return request({
    url: API_BASE_URL + "/api/comment/modify",
    method: "PUT",
    body: JSON.stringify(commentModifyRequest),
  });
} //댓글 수정하기 위해서 원 댓글 불러오기 요청

export function DeleteComment(commentDeleteRequest) {
  return request({
    url: API_BASE_URL + "/api/comment/delete/{comment-id}",
    method: "DELETE",
    body: JSON.stringify(commentDeleteRequest),
  });
} //댓글 삭제 요청

export function CommentData(commentID) {
  return request({
    url: API_BASE_URL + "/api/comment/{article-id}",
    method: "GET",
    body: JSON.stringify(commentID),
  });
} //댓글 정보 불러오기 요청

export function CreateReplyComment(commentReplyCreateRequest) {
  return request({
    url: API_BASE_URL + "/api/comment/",
    method: "POST",
    body: JSON.stringify(commentReplyCreateRequest),
  });
} //대댓글 작성 등록 요청

export function DeleteReplyComment(commentReplyDeleteRequest) {
  return request({
    url: API_BASE_URL + "/api/comment/",
    method: "DELETE",
    body: JSON.stringify(commentReplyDeleteRequest),
  });
} //대댓글 삭제 요청

export function ReplyCommentData(commentID) {
  return request({
    url: API_BASE_URL + "/api/comment/{article-id}",
    method: "GET",
    body: JSON.stringify(commentID),
  });
} //대댓글 정보 불러오기 요청

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
