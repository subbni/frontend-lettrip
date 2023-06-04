import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  commentData,
  replyCommentData,
  modifyComment,
  deleteComment,
} from "../../../Service/ArticleService";
import { ACCESS_TOKEN } from "../../../Constant/backendAPI";
import ReplyCommentCreate from "./ReplyCommentCreate";
import "./Comments.css";

function Comments({ userEmail, userNickname }) {
  const { id, parent_comment_id } = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부를 저장하는 상태
  const [comments, setComments] = useState([]);
  const [replycomments, setReplyComments] = useState([]);
  const [editingComment, setEditingComment] = useState({});
  const [editingReplyComment, setEditingReplyComment] = useState({});
  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,ASC",
    article_id: id,
    parent_id: parent_comment_id,
  }); //댓글 보여주기 : 5개씩, 오래된 순
  const [commentForm, setCommentForm] = useState({
    content: "",
  }); //댓글 작성시 요청 정보, id는 댓글 id
  const [replyCommentForm, setReplyCommentForm] = useState({
    article_id: id,
    content: "",
    parent_comment_id: parent_comment_id,
    mentioned_user_email: userEmail,
    mentioned_user_nickname: userNickname,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem(ACCESS_TOKEN);
    const storedEmail = localStorage.getItem("email");
    if (storedToken && storedEmail) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
    if (parent_comment_id) {
      fetchReplyComments();
    }
  }, [parent_comment_id]);

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

  //대댓글 불러오기
  const fetchReplyComments = (parent_id) => {
    const replyPageForm = {
      ...pageForm,
      parent_id: parent_id,
    };
    console.log(replyPageForm);
    replyCommentData(replyPageForm)
      .then((response) => {
        const updatedComments = comments.map((comment) => {
          if (comment.id === parent_id) {
            return {
              ...comment,
              reply: response.content,
              handleShowReplycomment: true,
            };
          }
          return comment;
        });
        setComments(updatedComments);
        setReplyComments(response.content);
        console.log(response);
      })
      .catch((e) => {
        console.log(e);
        window.alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };
  const handleShowReplycomment = (parent_id) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === parent_id) {
        return {
          ...comment,
          handleShowReplycomment: !comment.handleShowReplycomment,
        };
      }
      return comment;
    });
    setComments(updatedComments);
    if (
      updatedComments.find((comment) => comment.id === parent_id)
        .handleShowReplycomment
    ) {
      fetchReplyComments(parent_id);
    }
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
  // 대댓글 수정하기
  const handleReplyCommentFormChange = (e) => {
    const { name, value } = e.target;
    setReplyCommentForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleReplyCommentFormSubmit = (e, replyId) => {
    e.preventDefault();
    if (window.confirm("대댓글을 수정하시겠습니까?")) {
      const modifyReplyForm = {
        id: replyId,
        content: replyCommentForm.content,
      };
      modifyComment(modifyReplyForm)
        .then((response) => {
          window.alert("대댓글 수정이 완료되었습니다.");
          fetchReplyComments(parent_comment_id);
          setReplyCommentForm((prevState) => ({
            ...prevState,
            content: "",
          }));
          setEditingReplyComment({});
        })
        .catch((e) => {
          console.log(e);
          window.alert(
            "대댓글 수정에 실패했습니다. 다시 시도해주시길 바랍니다."
          );
        });
    }
  };
  const handleModifyReplyComment = (replyId) => {
    const replyComment = replycomments.find(
      (replyComment) => replyComment.id === replyId
    );
    if (replyComment) {
      setEditingReplyComment(replyComment);
      setReplyCommentForm((prevState) => ({
        ...prevState,
        content: replyComment.content,
      }));
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

  return (
    <div className='Comment_container'>
      <div className='ShowComments'>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div className='commenteach' key={comment.id}>
              <h3 className='nickname'>{comment.nickname}</h3>
              <p className='createdDate'>{comment.createdDate}</p>
              {editingComment.id === comment.id ? (
                <form onSubmit={handleCommentFormSubmit}>
                  <textarea
                    id='content'
                    name='content'
                    placeholder='댓글을 입력하세요.'
                    required
                    value={commentForm.content}
                    onChange={handleCommentFormChange}
                  />
                  <button type='submit'>완료</button>
                </form>
              ) : (
                <p className='content'>{comment.content}</p>
              )}

              {isLoggedIn && ( //댓글 작성자에게만 수정 버튼 보이게 하기
                <button
                  className='ModifyComment_button'
                  onClick={() => handleModifyComment(comment.id)}
                >
                  수정
                </button>
              )}
              {isLoggedIn && ( //댓글 작성자에게만 삭제 버튼 보이게 하기
                <button
                  className='DeleteComment_button'
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  삭제
                </button>
              )}
              <div className='ShowReplyComments'>
                <button
                  className='ShowReplycomment_button'
                  onClick={() => handleShowReplycomment(comment.id)}
                >
                  {comment.handleShowReplycomment ? "답글 닫기" : "답글 보기"}
                </button>
                {comment.handleShowReplycomment &&
                  comment.reply &&
                  comment.reply.length > 0 && (
                    <div className='ReplyComments'>
                      {comment.reply.map((reply) => (
                        <div key={reply.id}>
                          <h4 className='nickname'>{reply.nickname}</h4>
                          <p className='createdDate'>{reply.createdDate}</p>
                          {editingReplyComment.id === reply.id ? (
                            <form onSubmit={handleReplyCommentFormSubmit}>
                              <textarea
                                id='content'
                                name='content'
                                placeholder='댓글을 입력하세요.'
                                required
                                value={commentForm.content}
                                onChange={handleReplyCommentFormChange}
                              />
                              <button type='submit'>완료</button>
                            </form>
                          ) : (
                            <p className='content'>{reply.content}</p>
                          )}
                          {isLoggedIn && ( //대댓글 작성자에게만 수정 버튼 보이게 하기
                            <button
                              className='ModifyReplyComment_button'
                              onClick={() => handleModifyReplyComment(reply.id)}
                            >
                              수정
                            </button>
                          )}
                          {isLoggedIn && ( //대댓글 작성자에게만 삭제 버튼 보이게 하기
                            <button
                              className='DeleteReplyComment_button'
                              onClick={() => handleDeleteComment(reply.id)}
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
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
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
export default Comments;
