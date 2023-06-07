import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  commentData,
  modifyComment,
  deleteComment,
} from "../../../Service/ArticleService";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI";
import ReplyCommentCreate from "./ReplyCommentCreate";
import "./Comments.css";

function Comments({ userEmail }) {
  const { id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState({});

  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,ASC",
    article_id: id,
  }); //댓글 보여주기 : 5개씩, 오래된 순
  const [commentForm, setCommentForm] = useState({
    content: "",
  }); //댓글 작성시 요청 정보, id는 댓글 id

  useEffect(() => {
    //로그인 여부 확인하기
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    if (storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    //댓글 작성자와 로그인 사용자 동일 여부 확인하기
    const storedEmail = localStorage.getItem("email");
    console.log(storedEmail);
    if ({ userEmail } === storedEmail) {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, []);

  //댓글 불러오기
  const fetchComments = () => {
    commentData(pageForm)
      .then((response) => {
        setComments(response.content);
      })
      .catch((e) => {
        console.log(e);
        window.alert("댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };

  //댓글 수정하기
  const handleCommentFormChange = (e) => {
    const { name, value } = e.target;
    setCommentForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleCommentFormSubmit = (e) => {
    e.preventDefault();
    if (window.confirm("댓글을 수정하시겠습니까?")) {
      if (editingComment.id) {
        const modifyForm = {
          id: editingComment.id,
          content: commentForm.content,
        };
        modifyComment(modifyForm)
          .then((response) => {
            window.alert("댓글 수정이 완료되었습니다.");
            console.log(response);
            fetchComments();
            setCommentForm({ content: "" });
            setEditingComment({});
          })
          .catch((e) => {
            console.log(e);
            window.alert(
              "댓글 수정에 실패했습니다. 다시 시도해주시길 바랍니다."
            );
          });
      }
    }
  };
  const handleModifyComment = (commentId) => {
    const comment = comments.find((comment) => comment.id === commentId);
    if (comment) {
      setEditingComment(comment);
      setCommentForm({ content: comment.content });
    }
  };

  //댓글 삭제하기
  const handleDeleteComment = (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      deleteComment(commentId)
        .then((response) => {
          window.alert("댓글이 삭제되었습니다.");
          console.log(response);
          fetchComments();
        })
        .catch((e) => {
          console.log(e);
          window.alert("댓글 삭제에 실패했습니다.");
        });
    }
  };
  // 한국 시차 설정하기
  const getKoreanDateTime = (dateString) => {
    const options = {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(dateString).toLocaleString("ko-KR", options);
  };

  return (
    <div className='comments-container'>
      <div className='show-comments'>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id}>
              <h3 className='comment-nickname'>{comment.nickname}</h3>
              <div className='comment-views'>
                <p className='comment-createdDate'>
                  {getKoreanDateTime(comment.createdDate)}
                </p>
                {isEditable && (
                  <p
                    className='comment-modify'
                    onClick={() => handleModifyComment(comment.id)}
                  >
                    수정
                  </p>
                )}
                {isEditable && (
                  <p
                    className='comment-delete'
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    삭제
                  </p>
                )}
              </div>
              {editingComment.id === comment.id ? (
                <form
                  className='comment-modfiy-input'
                  onSubmit={handleCommentFormSubmit}
                >
                  <textarea
                    id='content'
                    name='content'
                    placeholder='댓글을 입력하세요.'
                    required
                    value={commentForm.content}
                    onChange={handleCommentFormChange}
                  />
                  <button className='comment-submit' type='submit'>
                    완료
                  </button>
                </form>
              ) : (
                <p
                  className='comment-content'
                  onClick={() => handleModifyComment(comment.id)}
                >
                  {comment.content}
                </p>
              )}

              <div className='replycomments-container'>
                <div className='show-replycomments'>
                  {comment.handleShowReplycomment ? "닫기" : "답글 더보기"}
                  {comment.handleShowReplycomment && (
                    <ReplyCommentCreate
                      id={id}
                      parent_comment_id={comment.id}
                      mentioned_user_nickname={comment.nickname}
                      mentioned_user_email={userEmail}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
export default Comments;
