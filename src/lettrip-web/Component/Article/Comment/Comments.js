import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  commentData,
  replyCommentData,
  modifyComment,
  deleteComment,
} from "../../../Service/ArticleService";

import ReplyCommentCreate from "./ReplyCommentCreate";

import { AiFillSetting } from "react-icons/ai";
import "./Comments.css";

function Comments({ userEmail }) {
  const { id, parent_comment_id } = useParams();

  const [commentOptions, setCommentOptions] = useState(false);
  const menuRef = useRef();

  const [comments, setComments] = useState([]);
  const [replyComments, setReplyComments] = useState([]);

  const [editingComment, setEditingComment] = useState({});
  const [editingReplyComment, setEditingReplyComment] = useState({});

  const [pageForm, setPageForm] = useState({
    page: 0,
    size: 5,
    sort: "id,ASC",
    article_id: id,
  }); //댓글 보여주기 : 5개씩, 오래된 순
  const [commentForm, setCommentForm] = useState({
    content: "",
  }); //댓글 작성시 요청 정보, id는 댓글 id
  const [replyCommentForm, setReplyCommentForm] = useState({
    article_id: id,
    content: "",
    parent_comment_id: parent_comment_id,
    mentioned_user_email: userEmail,
  });

  useEffect(() => {
    //댓글 설정 버튼 누르기
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchComments();
    if (parent_comment_id) {
      fetchReplyComments();
    }
  }, [parent_comment_id]);

  // 댓글 작성자의 닉네임과 현재 로그인한 사용자의 닉네임 비교하여 동일한지 확인하는 함수
  const isEditable = (commentNickname) => {
    const storedNickname = localStorage.getItem("nickname");
    return commentNickname === storedNickname;
  };

  //댓글 불러오기
  const fetchComments = () => {
    commentData(pageForm)
      .then((response) => {
        const updatedComments = response.content.map((comment) => ({
          ...comment,
          options: false, // 설정 버튼 상태 초기값
        }));
        setComments(updatedComments);
      })
      .catch((e) => {
        console.log(e);
        alert("댓글을 불러오는 중에 오류가 발생했습니다.");
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
        alert("대댓글을 불러오는 중에 오류가 발생했습니다.");
      });
  };
  //'더보기' 버튼을 눌렀을 때
  const moreReplyComment = (parent_id) => {
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
    if (editingComment.id) {
      if (window.confirm("댓글을 수정하시겠습니까?")) {
        const modifyForm = {
          id: editingComment.id,
          content: commentForm.content,
        };
        modifyComment(modifyForm)
          .then((response) => {
            alert("댓글 수정이 완료되었습니다.");
            console.log(response);
            fetchComments();
            setCommentForm({ content: "" });
            setEditingComment({});
          })
          .catch((e) => {
            console.log(e);
            alert("댓글 수정에 실패했습니다. 다시 시도해주시길 바랍니다.");
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
  const handleModifyCommentFormChange = (e) => {
    const { name, value } = e.target;
    setReplyCommentForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleModifyCommentFormSubmit = (e, replyId) => {
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
    const replyComment = replyComments.find(
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

  //설정 아이콘 누르면 메뉴 나오게 하기 (수정, 삭제, ?URL복사)
  const commentSettings = (commentId) => {
    setComments((prevState) =>
      prevState.map((comment) =>
        comment.id === commentId
          ? { ...comment, options: !comment.options }
          : { ...comment, options: false }
      )
    );
  };
  function handleClickOutside(e) {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setCommentOptions(false);
      setComments((prevState) =>
        prevState.map((comment) => ({ ...comment, options: false }))
      );
    }
  }

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
                <p
                  className='comment-settings'
                  onClick={() => commentSettings(comment.id)}
                >
                  <AiFillSetting />
                </p>
                {comment.options && (
                  <div className='comment-setting-options'>
                    {isEditable(comment.nickname) && (
                      <div
                        className='comment-modify'
                        onClick={() => handleModifyComment(comment.id)}
                      >
                        수정
                      </div>
                    )}
                    {isEditable(comment.nickname) && (
                      <div
                        className='comment-delete'
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        삭제
                      </div>
                    )}
                  </div>
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
                  <p
                    className='showReplycomment-button'
                    onClick={() => moreReplyComment(comment.id)}
                  >
                    {comment.moreReplyComment ? "답글 닫기" : "답글 보기"}
                  </p>
                  {comment.moreReplyComment &&
                    comment.reply &&
                    comment.reply.length > 0 &&
                    comment.reply.map((reply) => (
                      <div key={reply.id}>
                        <h4 className='replycomment-nickname'>
                          {reply.nickname}
                        </h4>
                        <div className='replycomment-views'>
                          <p className='replycomment-createdDate'>
                            {getKoreanDateTime(reply.createdDate)}
                          </p>
                          {isEditable(comment.nickname) && (
                            <p
                              className='replycomment-modify'
                              onClick={() => handleModifyReplyComment(reply.id)}
                            >
                              수정
                            </p>
                          )}
                          {isEditable(comment.nickname) && (
                            <p
                              className='replycomment-delete'
                              onClick={() => handleDeleteComment(reply.id)}
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
                      </div>
                    ))}
                  {comment.handleShowReplycomment && (
                    <ReplyCommentCreate
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
